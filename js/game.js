class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = null;
        this.map = null;
        this.entities = {
            towers: [],
            keys: [],
            shards: [],
            bullets: []
        };
        this.centralHub = null;
        this.baseStation = null;
        this.systemHealth = 50; // Starting at 50%
        this.isGameOver = false;
        this.isPaused = false;
        this.keysPressed = {};
        this.lastFrameTime = 0;
    }
    
    init() {
        // Set canvas size to window size
        this.handleResize();
        
        // Generate the map
        this.map = MapGenerator.generateMap(this.canvas.width, this.canvas.height);
        
        // Create player at a valid starting position
        const startPos = this.findValidStartPosition();
        this.player = new Player(startPos.x, startPos.y);
        
        // Create central hub and base station
        this.centralHub = new CentralHub(this.canvas.width / 4, this.canvas.height / 2);
        this.baseStation = new BaseStation(this.canvas.width * 3 / 4, this.canvas.height / 2);
        
        // Generate surveillance towers
        this.generateTowers();
        
        // Generate initial keys
        this.generateKeys(5);
        
        // Initialize HUD
        HUD.init(this);
    }
    
    start() {
        // Start the game loop
        requestAnimationFrame(this.gameLoop.bind(this));
        
        // Start system health decay
        this.startSystemHealthDecay();
    }
    
    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - (this.lastFrameTime || timestamp);
        this.lastFrameTime = timestamp;
        
        if (!this.isPaused && !this.isGameOver) {
            this.update(deltaTime);
        }
        
        this.render();
        
        // Continue the game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    update(deltaTime) {
        // Update player
        this.player.update(deltaTime, this.keysPressed, this.map);
        
        // Update towers
        this.entities.towers.forEach(tower => {
            tower.update(deltaTime);
            
            // Check if player is in tower's detection zone
            if (tower.isPlayerDetected(this.player)) {
                this.player.takeDamage(0.1 * deltaTime / 16); // Damage per frame
            }
        });
        
        // Update bullets
        this.entities.bullets.forEach((bullet, index) => {
            bullet.update(deltaTime, this.map);
            
            // Check for bullet collisions with towers
            this.entities.towers.forEach((tower, towerIndex) => {
                if (Collision.checkCollision(bullet, tower)) {
                    tower.takeDamage(bullet.damage);
                    this.entities.bullets.splice(index, 1);
                    
                    // Remove tower if destroyed
                    if (tower.health <= 0) {
                        this.entities.towers.splice(towerIndex, 1);
                    }
                    return;
                }
            });
            
            // Remove bullets that have expired
            if (bullet.speed <= 0 || bullet.bounces >= bullet.maxBounces) {
                this.entities.bullets.splice(index, 1);
            }
        });
        
        // Check for key collection
        this.entities.keys.forEach((key, index) => {
            if (Collision.checkCollision(this.player, key)) {
                this.player.collectKey();
                this.entities.keys.splice(index, 1);
                
                // Generate a new key elsewhere
                this.generateKeys(1);
            }
        });
        
        // Check for central hub interaction
        // Check for central hub interaction
        if (this.centralHub.isPlayerInside(this.player)) {
            // Update the central hub
            this.centralHub.update(deltaTime);
            
            // Check if player has keys and hub can decrypt
            if (this.player.keys > 0 && this.centralHub.canDecryptShard()) {
                // Start decryption process
                const keysUsed = this.centralHub.decryptShard();
                this.player.useKeys(keysUsed);
                
                // Show a message to the player
                console.log("Decryption started! Stay in the hub for 3 seconds.");
            }
            
            // Check if any shards are ready to collect
            const decryptedShard = this.centralHub.getDecryptedShard();
            if (decryptedShard) {
                this.player.collectShard();
                console.log("Shard decrypted and collected!");
            }
        }
        
        // Check for base station interaction
        if (Collision.checkCollision(this.player, this.baseStation)) {
            if (this.player.shards > 0) {
                const shardsDelivered = this.player.deliverShards();
                this.increaseSystemHealth(shardsDelivered * 10); // Each shard increases system health by 10%
            }
        }
        
        // Check win/loss conditions
        this.checkGameState();
    }
    
    render() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render the map
        MapRenderer.renderMap(this.ctx, this.map);
        
        // Render central hub and base station
        this.centralHub.render(this.ctx);
        this.baseStation.render(this.ctx);
        
        // Render entities
        this.entities.towers.forEach(tower => tower.render(this.ctx));
        this.entities.keys.forEach(key => key.render(this.ctx));
        this.entities.bullets.forEach(bullet => bullet.render(this.ctx));
        
        // Render player
        this.player.render(this.ctx);
        
        // Update HUD
        HUD.update(this);
        
        // Render game over screen if needed
        if (this.isGameOver) {
            this.renderGameOver();
        }
    }
    
    handleKeyDown(e) {
        this.keysPressed[e.key] = true;
        
        // Toggle pause with Escape key
        if (e.key === 'Escape') {
            this.togglePause();
        }
    }
    
    handleKeyUp(e) {
        this.keysPressed[e.key] = false;
    }
    
    handleMouseClick(e) {
        if (!this.isPaused && !this.isGameOver) {
            // Calculate direction vector from player to click position
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Create a new bullet
            this.player.shoot(clickX, clickY, this.entities.bullets);
        }
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Re-render if the game is paused
        if (this.isPaused) {
            this.render();
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        Menu.toggleMenu(this.isPaused);
    }
    
    restart() {
        // Reset game state
        this.entities = {
            towers: [],
            keys: [],
            shards: [],
            bullets: []
        };
        this.systemHealth = 50;
        this.isGameOver = false;
        this.isPaused = false;
        
        // Re-initialize the game
        this.init();
    }
    
    startSystemHealthDecay() {
        // System health decreases over time
        setInterval(() => {
            if (!this.isPaused && !this.isGameOver) {
                this.decreaseSystemHealth(0.1); // Decrease by 0.1% every 100ms
            }
        }, 100);
    }
    
    increaseSystemHealth(amount) {
        this.systemHealth = Math.min(100, this.systemHealth + amount);
        
        // Check for win condition
        if (this.systemHealth >= 100) {
            this.win();
        }
    }
    
    decreaseSystemHealth(amount) {
        this.systemHealth = Math.max(0, this.systemHealth - amount);
        
        // Check for loss condition
        if (this.systemHealth <= 0) {
            this.gameOver();
        }
    }
    
    findValidStartPosition() {
        // Find a valid starting position for the player (on a walkable tile)
        let x, y;
        do {
            x = Math.floor(Math.random() * this.canvas.width);
            y = Math.floor(Math.random() * this.canvas.height);
        } while (!MapGenerator.isWalkable(this.map, x, y));
        
        return { x, y };
    }
    
    generateTowers() {
        // Generate surveillance towers at strategic locations
        const numTowers = 5;
        for (let i = 0; i < numTowers; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.canvas.width);
                y = Math.floor(Math.random() * this.canvas.height);
            } while (!MapGenerator.isWalkable(this.map, x, y));
            
            this.entities.towers.push(new Tower(x, y));
        }
    }
    
    generateKeys(count) {
        // Generate keys at random walkable locations
        for (let i = 0; i < count; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.canvas.width);
                y = Math.floor(Math.random() * this.canvas.height);
            } while (!MapGenerator.isWalkable(this.map, x, y));
            
            this.entities.keys.push(new Key(x, y));
        }
    }
    
    checkGameState() {
        // Check if player is dead
        if (this.player.health <= 0) {
            this.gameOver();
        }
        
        // Check if system health is at 100% (win condition)
        if (this.systemHealth >= 100) {
            this.win();
        }
    }
    
    gameOver() {
        this.isGameOver = true;
        Storage.saveScore(this.systemHealth);
    }
    
    win() {
        this.isGameOver = true;
        Storage.saveScore(100);
    }
    
    renderGameOver() {
        // Render game over or win screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        
        if (this.systemHealth >= 100) {
            this.ctx.fillText('You Win!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        } else {
            this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50);
        }
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
}
