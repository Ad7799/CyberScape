// Define the main Game class that manages all game elements and logic
class Game {
    // Constructor initializes all game properties and references
    constructor() {
        this.canvas = document.getElementById('gameCanvas');    // Reference to the HTML canvas element
        this.ctx = this.canvas.getContext('2d');                // 2D rendering context for drawing
        this.player = null;                                     // Player object (initialized later)
        this.map = null;                                        // Game map (initialized later)
        this.entities = {                                       // Container for all game entities
            towers: [],                                         // Array of security towers
            keys: [],                                           // Array of collectible keys
            shards: [],                                         // Array of data shards
            bullets: [],                                        // Array of projectiles
            powerUps: [],                                       // Array of power-ups
            bots: []                                            // Array of enemy bots
        };
        this.centralHub = null;                                 // Central hub for decrypting shards (initialized later)
        this.baseStation = null;                                // Base station for delivering shards (initialized later)
        this.systemHealth = 50;                                 // Starting system health at 50%
        this.isGameOver = false;                                // Flag to track game over state
        this.isPaused = false;                                  // Flag to track pause state
        this.keysPressed = {};                                  // Object to track currently pressed keys
        this.lastFrameTime = 0;                                 // Timestamp of the last frame for delta time calculation
    }
    
    // Initialize the game by setting up all necessary components
    init() {
        // Set canvas size to match the window
        this.handleResize();
        
        // Generate the game map based on canvas dimensions
        this.map = MapGenerator.generateMap(this.canvas.width, this.canvas.height);
        
        // Find a valid starting position and create the player there
        const startPos = this.findValidStartPosition();
        this.player = new Player(startPos.x, startPos.y);
        
        // Create the central hub and base station at fixed positions
        this.centralHub = new CentralHub(this.canvas.width / 4, this.canvas.height / 2);      // Left side of map
        this.baseStation = new BaseStation(this.canvas.width * 3 / 4, this.canvas.height / 2); // Right side of map
        
        // Generate enemy towers throughout the map
        this.generateTowers();
        
        // Generate initial set of collectible keys
        this.generateKeys(5);
        
        // Initialize the heads-up display
        HUD.init(this);
    }
    
    // Start the game by initiating the game loop and health decay
    start() {
        // Begin the animation loop using requestAnimationFrame
        requestAnimationFrame(this.gameLoop.bind(this));
        
        // Start the system health decay timer
        this.startSystemHealthDecay();
    }
    
    // Main game loop that runs every frame
    gameLoop(timestamp) {
        // Calculate time elapsed since last frame in milliseconds
        const deltaTime = timestamp - (this.lastFrameTime || timestamp);
        this.lastFrameTime = timestamp;
        
        // Only update game state if not paused or game over
        if (!this.isPaused && !this.isGameOver) {
            this.update(deltaTime);
        }
        
        // Always render the current state, even when paused
        this.render();
        
        // Schedule the next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // Update all game elements based on elapsed time
    update(deltaTime) {
        // Update player position and state
        this.player.update(deltaTime, this.keysPressed, this.map);
        
        // Update each tower and check for player detection
        this.entities.towers.forEach(tower => {
            tower.update(deltaTime);
            
            // If player is detected by a tower, apply damage over time
            if (tower.isPlayerDetected(this.player)) {
                this.player.takeDamage(0.1 * deltaTime / 16); // Scale damage by frame time
            }
        });
        
        // Update each bot
        this.entities.bots.forEach(bot => {
            bot.update(deltaTime, this.player, this.map);
            // Check if the bot shoots and add the bullet to the game
            const bullet = bot.shoot(this.player);
            if (bullet) {
                this.entities.bullets.push(bullet);
            }
        });
        
        // Check for collisions between bullets and entities (towers, bots, player)
        this.entities.bullets.forEach((bullet, bulletIndex) => {
            bullet.update(deltaTime, this.map);

            let hit = false;

            // Check for collisions between player bullets and bots
            if (bullet.isPlayerBullet) {
                this.entities.bots.forEach((bot, botIndex) => {
                    if (Collision.checkCollision(bullet, bot)) {
                        const botDestroyed = bot.takeDamage(bullet.damage);
                        this.entities.bullets.splice(bulletIndex, 1); // Remove the bullet
                        if (botDestroyed) {
                            this.entities.bots.splice(botIndex, 1); // Remove the bot if destroyed
                        }
                        hit = true;
                        return; // Stop checking collisions for this bullet against bots
                    }
                });
            }

            if (hit) return; // If the bullet hit a bot, move to the next bullet

            // Check for collisions between bullets and towers (assuming towers are only hit by player bullets or specific bot bullets)
            // You might want to add logic here to check if the bullet is allowed to damage towers
            this.entities.towers.forEach((tower, towerIndex) => {
                 // Assuming only player bullets damage towers for now
                if (bullet.isPlayerBullet && Collision.checkCollision(bullet, tower)) {
                    tower.takeDamage(bullet.damage);           // Apply damage to tower
                    this.entities.bullets.splice(bulletIndex, 1);    // Remove the bullet
                    // Remove tower if its health reaches zero
                    if (tower.health <= 0) {
                        this.entities.towers.splice(towerIndex, 1);
                    }
                    hit = true;
                    return; // Stop checking collisions for this bullet against towers
                }
            });

            if (hit) return; // If the bullet hit a tower, move to the next bullet

            // Check for collisions between bot bullets and the player
            if (!bullet.isPlayerBullet && Collision.checkCollision(bullet, this.player)) {
                this.player.takeDamage(bullet.damage);
                this.entities.bullets.splice(bulletIndex, 1);
                hit = true;
                return; // Stop checking collisions for this bullet
            }


            // Remove bullets that have expired (no speed or max bounces reached)
            if (bullet.speed <= 0 || bullet.bounces >= bullet.maxBounces) {
                this.entities.bullets.splice(bulletIndex, 1);
            }
        });
        
        // Check if player has collected any keys
        this.entities.keys.forEach((key, index) => {
            if (Collision.checkCollision(this.player, key)) {
                this.player.collectKey();                      // Add key to player inventory
                this.entities.keys.splice(index, 1);           // Remove the collected key
                
                // Generate a new key elsewhere to maintain key count
                this.generateKeys(1);
            }
        });

        // Check if player has collected any power-ups
        this.entities.powerUps.forEach((powerUp, index) => {
            if (Collision.checkCollision(this.player, powerUp)) {
                powerUp.applyEffect(this.player);              // Apply power-up effect to player
                this.entities.powerUps.splice(index, 1);       // Remove the collected power-up
            }
        });

        // Handle central hub interaction when player is inside
        if (this.centralHub.isPlayerInside(this.player)) {
            // Update the central hub's internal state
            this.centralHub.update(deltaTime);
            
            // If player has keys and hub can decrypt, start decryption process
            if (this.player.keys > 0 && this.centralHub.canDecryptShard()) {
                // Start decryption and consume keys
                const keysUsed = this.centralHub.decryptShard();
                this.player.useKeys(keysUsed);
                
                // Notify player about decryption (should use HUD.showMessage instead of console.log)
                console.log("Decryption started! Stay in the hub for 3 seconds.");
            }
            
            // Check if any shards are ready to collect
            const decryptedShard = this.centralHub.getDecryptedShard();
            if (decryptedShard) {
                this.player.collectShard();                    // Add shard to player inventory
                console.log("Shard decrypted and collected!"); // Should use HUD.showMessage
            }
        }
        
        // Handle base station interaction when player collides with it
        if (Collision.checkCollision(this.player, this.baseStation)) {
            if (this.player.shards > 0) {
                // Deliver shards to increase system health
                const shardsDelivered = this.player.deliverShards();
                this.increaseSystemHealth(shardsDelivered * 10); // Each shard is worth 10% health
            }
        }
        
        // Check for win/loss conditions
        this.checkGameState();
    }
    
    // Render all game elements to the canvas
    render() {
        // Clear the entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the map tiles
        MapRenderer.renderMap(this.ctx, this.map);
        
        // Draw the central hub and base station
        this.centralHub.render(this.ctx);
        this.baseStation.render(this.ctx);
        
        // Draw all entities in the game world
        this.entities.towers.forEach(tower => tower.render(this.ctx));
        this.entities.keys.forEach(key => key.render(this.ctx));
        this.entities.bullets.forEach(bullet => bullet.render(this.ctx));
        this.entities.powerUps.forEach(powerUp => powerUp.render(this.ctx)); // Draw power-ups
        this.entities.bots.forEach(bot => bot.render(this.ctx)); // Draw bots
        
        // Draw the player character
        this.player.render(this.ctx);
        
        // Update the HUD with current game state
        HUD.update(this);
        
        // Draw game over screen if the game has ended
        if (this.isGameOver) {
            this.renderGameOver();
        }
    }
    
    // Handle key press events
    handleKeyDown(e) {
        this.keysPressed[e.key] = true;                        // Mark key as pressed
        
        // Toggle pause state when Escape key is pressed
        if (e.key === 'Escape') {
            this.togglePause();
        }
        
        // Restart the game when R key is pressed and the game is over
        if (e.key === 'r' || e.key === 'R') {
            if (this.isGameOver) {
                this.restart();
            }
        }
    }
    
    // Handle key release events
    handleKeyUp(e) {
        this.keysPressed[e.key] = false;                       // Mark key as released
    }
    
    // Handle mouse click events for shooting
    handleMouseClick(e) {
        if (!this.isPaused && !this.isGameOver) {
            // Convert mouse position to canvas coordinates
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;              // X position relative to canvas
            const clickY = e.clientY - rect.top;               // Y position relative to canvas
            
            // Tell player to shoot toward the clicked position
            this.player.shoot(clickX, clickY, this.entities.bullets);
        }
    }
    
    // Handle window resize events
    handleResize() {
        this.canvas.width = window.innerWidth;                 // Set canvas width to window width
        this.canvas.height = window.innerHeight;               // Set canvas height to window height
        
        // Re-render if the game is paused to show updated canvas size
        if (this.isPaused) {
            this.render();
        }
    }
    
    // Toggle between paused and unpaused states
    togglePause() {
        this.isPaused = !this.isPaused;                        // Flip pause state
        Menu.toggleMenu(this.isPaused);                        // Show/hide pause menu
    }
    
    // Reset the game to initial state
    restart() {
        // Clear all entity arrays
        this.entities = {
            towers: [],
            keys: [],
            shards: [],
            bullets: [],
            powerUps: [], // Ensure powerUps are cleared on restart
            bots: []      // Clear the bots array on restart
        };
        this.systemHealth = 50;                                // Reset system health to 50%
        this.isGameOver = false;                               // Clear game over flag
        this.isPaused = false;                                 // Unpause the game
        
        // Re-initialize all game components
        this.init();
    }
    
    // Start the timer that gradually decreases system health
    startSystemHealthDecay() {
        // Set up interval to decrease health over time
        setInterval(() => {
            if (!this.isPaused && !this.isGameOver) {
                this.decreaseSystemHealth(0.1);                // Decrease by 0.1% every 100ms
            }
        }, 100);
    }
    
    // Increase system health by specified amount, capped at 100%
    increaseSystemHealth(amount) {
        this.systemHealth = Math.min(100, this.systemHealth + amount);
        
        // Check for win condition (system fully restored)
        if (this.systemHealth >= 100) {
            this.win();
        }
    }
    
    // Decrease system health by specified amount, minimum 0%
    decreaseSystemHealth(amount) {
        this.systemHealth = Math.max(0, this.systemHealth - amount);
        
        // Check for loss condition (system failure)
        if (this.systemHealth <= 0) {
            this.gameOver();
        }
    }
    
    // Find a random walkable position on the map for player start
    findValidStartPosition() {
        // Keep trying random positions until a walkable one is found
        let x, y;
        do {
            x = Math.floor(Math.random() * this.canvas.width);  // Random X within canvas
            y = Math.floor(Math.random() * this.canvas.height); // Random Y within canvas
        } while (!MapGenerator.isWalkable(this.map, x, y));     // Check if position is walkable
        
        // Return the valid position
        return { x, y };
    }
    
    // Generate enemy towers at random walkable positions
    generateTowers() {
        // Create a fixed number of towers
        const numTowers = 5;
        for (let i = 0; i < numTowers; i++) {
            // Find a valid position for each tower
            let x, y;
            do {
                x = Math.floor(Math.random() * this.canvas.width);  // Random X within canvas
                y = Math.floor(Math.random() * this.canvas.height); // Random Y within canvas
            } while (!MapGenerator.isWalkable(this.map, x, y));     // Check if position is walkable
            
            // Create and add the tower to the game
            this.entities.towers.push(new Tower(x, y));
        }
    }
    
    // Generate collectible keys at random walkable positions
    generateKeys(count) {
        // Create the specified number of keys
        for (let i = 0; i < count; i++) {
            // Find a valid position for each key
            let x, y;
            do {
                x = Math.floor(Math.random() * this.canvas.width);  // Random X within canvas
                y = Math.floor(Math.random() * this.canvas.height); // Random Y within canvas
            } while (!MapGenerator.isWalkable(this.map, x, y));     // Check if position is walkable
            
            // Create and add the key to the game
            this.entities.keys.push(new Key(x, y));
        }
    }
    
    // Check for win/loss conditions
    checkGameState() {
        // Check if player has died
        if (this.player.health <= 0) {
            this.gameOver();                                   // End game with loss
        }
        
        // Check if system is fully restored
        if (this.systemHealth >= 100) {
            this.win();                                        // End game with win
        }
    }
    
    // Handle game over (loss) condition
    gameOver() {
        this.isGameOver = true;                                // Set game over flag
        Storage.saveScore(this.systemHealth);                  // Save final score
    }
    
    // Handle win condition
    win() {
        this.isGameOver = true;                                // Set game over flag
        Storage.saveScore(100);                                // Save perfect score
    }
    
    // Render the game over or win screen
    renderGameOver() {
        // Draw semi-transparent black overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set text properties
        this.ctx.fillStyle = 'white';                          // White text
        this.ctx.font = '48px Arial';                          // Large font for main message
        this.ctx.textAlign = 'center';                         // Center-align text
        
        // Draw appropriate message based on win/loss
        if (this.systemHealth >= 100) {
            this.ctx.fillText('You Win!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        } else {
            this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50);
        }
        
        // Draw restart instructions
        this.ctx.font = '24px Arial';                          // Smaller font for instructions
        this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
}
