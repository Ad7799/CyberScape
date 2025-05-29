// Define a class representing the player character in the game
class Player {
    // Constructor initializes a new player with position and default properties
    constructor(x, y) {
        this.x = x;                    // X-coordinate of the player's center
        this.y = y;                    // Y-coordinate of the player's center
        this.width = 20;               // Width of the player in pixels
        this.height = 20;              // Height of the player in pixels
        this.speed = 3;                // Movement speed in pixels per frame (reduced from 5 for better control)
        this.health = 100;             // Player's health points
        this.keys = 0;                 // Number of keys collected (used for decryption)
        this.shards = 0;               // Number of data shards collected (used to restore system)
        this.color = '#00FFFF';        // Cyan color for player representation
        this.isInvisible = false;      // Flag to indicate if player is currently invisible (power-up effect)
    }
    
    // Update method called each frame to handle player movement
    update(deltaTime, keysPressed, map) {
        // Calculate movement based on key presses
        let dx = 0;                    // Horizontal movement amount
        let dy = 0;                    // Vertical movement amount
        
        // Check which movement keys are pressed and adjust direction accordingly
        if (keysPressed['w'] || keysPressed['ArrowUp']) dy -= this.speed;    // Move up
        if (keysPressed['s'] || keysPressed['ArrowDown']) dy += this.speed;  // Move down
        if (keysPressed['a'] || keysPressed['ArrowLeft']) dx -= this.speed;  // Move left
        if (keysPressed['d'] || keysPressed['ArrowRight']) dx += this.speed; // Move right
        
        // Normalize diagonal movement to prevent faster diagonal speed
        if (dx !== 0 && dy !== 0) {
            const factor = 1 / Math.sqrt(2);  // Pythagorean factor for diagonal normalization
            dx *= factor;                     // Scale horizontal movement
            dy *= factor;                     // Scale vertical movement
        }
        
        // Calculate potential new position
        const newX = this.x + dx;             // Potential new X position
        const newY = this.y + dy;             // Potential new Y position
        
        // Check if horizontal movement is valid (not colliding with buildings)
        if (MapGenerator.isWalkable(map, newX, this.y)) {
            this.x = newX;                    // Apply horizontal movement if valid
        }
        
        // Check if vertical movement is valid (not colliding with buildings)
        if (MapGenerator.isWalkable(map, this.x, newY)) {
            this.y = newY;                    // Apply vertical movement if valid
        }
    }
    
    // Render method to draw the player on the canvas
    render(ctx) {
        ctx.fillStyle = this.color;           // Set fill color to cyan
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height); // Draw player as a square
    }
    
    // Method to reduce player's health when damaged
    takeDamage(amount) {
        if(this.isInvisible) return;           // Ignore damage if player is invisible (power-up effect)
        this.health = Math.max(0, this.health - amount); // Reduce health but not below zero
    }
    
    // Method to add a key to the player's inventory when collected
    collectKey() {
        this.keys++;                          // Increment key count
    }
    
    // Method to use keys for decryption
    useKeys(count) {
        this.keys = Math.max(0, this.keys - count); // Reduce key count but not below zero
    }
    
    // Method to add a data shard to the player's inventory when collected
    collectShard() {
        this.shards++;                        // Increment shard count
    }
    
    // Method to deliver all shards to the base station
    deliverShards() {
        const shardsDelivered = this.shards;  // Store current shard count
        this.shards = 0;                      // Reset shard count to zero
        return shardsDelivered;               // Return the number of shards delivered
    }
    
    // Method to create and fire a bullet in the direction of the target
    shoot(targetX, targetY, bulletArray) {
        // Calculate direction vector from player to target
        const dx = targetX - this.x;          // X component of direction vector
        const dy = targetY - this.y;          // Y component of direction vector
        
        // Normalize the direction vector to get a unit vector
        const length = Math.sqrt(dx * dx + dy * dy); // Calculate vector length
        const dirX = dx / length;             // Normalized X direction
        const dirY = dy / length;             // Normalized Y direction
        
        // Create a new bullet and add it to the game's bullet array
        const bullet = new Bullet(this.x, this.y, dirX, dirY); // Create bullet at player position with calculated direction
        bulletArray.push(bullet);             // Add bullet to the game's bullet array
    }
}