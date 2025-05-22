// Define a class representing the central hub in the game - a key location for data management
class CentralHub {
    // Constructor initializes a new central hub with position and default properties
    constructor(x, y) {
        this.x = x;                    // X-coordinate of the hub's center
        this.y = y;                    // Y-coordinate of the hub's center
        this.width = 50;               // Width of the hub in pixels
        this.height = 50;              // Height of the hub in pixels
        this.color = '#000000';        // Black color for the central hub
        this.shards = [];              // Array to store data shards
        this.maxShards = 5;            // Maximum number of shards the hub can hold
        this.decryptionCooldown = 0;   // Timer to control decryption frequency (in milliseconds)
        this.keysRequired = 1;         // Number of keys needed to decrypt a shard
    }
    
    // Update method called each frame to handle game logic
    update(deltaTime) {
        // Reduce the decryption cooldown timer based on elapsed time
        if (this.decryptionCooldown > 0) {
            this.decryptionCooldown -= deltaTime;
        }
        
        // Process each shard in the hub's collection
        this.shards.forEach((shard, index) => {
            // If a shard is encrypted and cooldown is complete, decrypt it
            if (shard.isEncrypted && this.decryptionCooldown <= 0) {
                // Call the shard's decrypt method to change its state
                shard.decrypt();
            }
        });
    }
    
    // Render method to draw the central hub on the canvas
    render(ctx) {
        // Draw the main body of the central hub as a blue square
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Draw a white highlight border if the player is inside the hub area
        if (this.isPlayerInside(window.game.player)) {
            ctx.strokeStyle = '#FFFFFF';           // White color for highlight
            ctx.lineWidth = 2;                     // 2-pixel border width
            ctx.strokeRect(this.x - this.width / 2 - 5, this.y - this.height / 2 - 5, this.width + 10, this.height + 10);
        }
        
        // Draw a yellow progress bar if decryption is in progress
        if (this.decryptionCooldown > 0) {
            // Calculate width based on remaining cooldown (3000ms seems to be max duration)
            const progressWidth = (this.width - 10) * (1 - this.decryptionCooldown / 3000);
            ctx.fillStyle = '#FFFF00';             // Yellow color for progress bar
            ctx.fillRect(this.x - this.width / 2 + 5, this.y + this.height / 2 + 5, progressWidth, 5);
        }
        
        // Draw a computer-like symbol in the center of the hub
        ctx.strokeStyle = '#FFFFFF';               // White color for the symbol
        ctx.lineWidth = 3;                         // 3-pixel line width
        ctx.beginPath();                           // Start a new drawing path
        ctx.rect(this.x - this.width / 3, this.y - this.height / 3, this.width * 2/3, this.height * 2/3);
        ctx.stroke();                              // Draw the rectangle outline
        
        // Draw all shards in a circular arrangement around the hub
        this.shards.forEach((shard, index) => {
            // Calculate position based on index to create a circular arrangement
            const angle = (index / this.maxShards) * Math.PI * 2;  // Angle in radians
            const shardX = this.x + Math.cos(angle) * (this.width / 2 + 20);  // X position on circle
            const shardY = this.y + Math.sin(angle) * (this.height / 2 + 20);  // Y position on circle
            
            // Update shard position and render it
            shard.x = shardX;                      // Set shard's X position
            shard.y = shardY;                      // Set shard's Y position
            shard.render(ctx);                     // Call shard's render method
        });
    }
    
    // Method to check if the hub can decrypt a new shard
    canDecryptShard() {
        // Return true if cooldown is complete and hub isn't at capacity
        return this.decryptionCooldown <= 0 && this.shards.length < this.maxShards;
    }
    
    // Method to create and start decrypting a new shard
    decryptShard() {
        // Create a new encrypted shard at the hub's position
        const shard = new Shard(this.x, this.y, true);
        this.shards.push(shard);                   // Add shard to the collection
        
        // Set cooldown timer to prevent immediate decryption of another shard
        this.decryptionCooldown = 1000;            // 1 second cooldown
        
        // Return the number of keys consumed by this operation
        return this.keysRequired;
    }
    
    // Method to retrieve a decrypted shard from the hub
    getDecryptedShard() {
        // Find the index of the first decrypted shard
        const index = this.shards.findIndex(shard => !shard.isEncrypted);
        
        // If a decrypted shard was found
        if (index !== -1) {
            // Remove the shard from the collection and return it
            return this.shards.splice(index, 1)[0];
        }
        
        // Return null if no decrypted shards are available
        return null;
    }
    
    // Method to check if the player is within the hub's interaction area
    isPlayerInside(player) {
        // Define a slightly larger detection area than the visual representation
        const detectionWidth = this.width * 1.2;   // 20% wider than the hub
        const detectionHeight = this.height * 1.2; // 20% taller than the hub
        
        // Check if player's position is within the detection area
        return Math.abs(player.x - this.x) < detectionWidth / 2 &&
               Math.abs(player.y - this.y) < detectionHeight / 2;
    }
}