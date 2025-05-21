class CentralHub {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = '#0000FF'; // Blue for central hub
        this.shards = [];
        this.maxShards = 5;
        this.decryptionCooldown = 0;
        this.keysRequired = 1; // Keys needed to decrypt a shard
    }
    
    update(deltaTime) {
        // Update decryption cooldown
        if (this.decryptionCooldown > 0) {
            this.decryptionCooldown -= deltaTime;
        }
        
        // Update shards if any
        this.shards.forEach((shard, index) => {
            if (shard.isEncrypted && this.decryptionCooldown <= 0) {
                // Decrypt a shard if cooldown is over
                shard.decrypt();
            }
        });
    }
    
    render(ctx) {
        // Draw the central hub
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Draw a highlight if player is inside
        if (this.isPlayerInside(window.game.player)) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - this.width / 2 - 5, this.y - this.height / 2 - 5, this.width + 10, this.height + 10);
        }
        
        // Draw decryption progress if in progress
        if (this.decryptionCooldown > 0) {
            const progressWidth = (this.width - 10) * (1 - this.decryptionCooldown / 3000);
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(this.x - this.width / 2 + 5, this.y + this.height / 2 + 5, progressWidth, 5);
        }
        
        // Draw a computer-like symbol
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(this.x - this.width / 3, this.y - this.height / 3, this.width * 2/3, this.height * 2/3);
        ctx.stroke();
        
        // Draw shards around the hub if any
        this.shards.forEach((shard, index) => {
            const angle = (index / this.maxShards) * Math.PI * 2;
            const shardX = this.x + Math.cos(angle) * (this.width / 2 + 20);
            const shardY = this.y + Math.sin(angle) * (this.height / 2 + 20);
            
            shard.x = shardX;
            shard.y = shardY;
            shard.render(ctx);
        });
    }
    
    canDecryptShard() {
        return this.decryptionCooldown <= 0 && this.shards.length < this.maxShards;
    }
    
    decryptShard() {
        // Create a new encrypted shard
        const shard = new Shard(this.x, this.y, true);
        this.shards.push(shard);
        
        // Start decryption cooldown
        this.decryptionCooldown = 1000; // 1 second
        
        // Return the number of keys used
        return this.keysRequired;
    }
    
    getDecryptedShard() {
        // Find a decrypted shard
        const index = this.shards.findIndex(shard => !shard.isEncrypted);
        
        if (index !== -1) {
            // Remove and return the decrypted shard
            return this.shards.splice(index, 1)[0];
        }
        
        return null;
    }
    
    isPlayerInside(player) {
        // Check if player is inside the central hub area
        // Make the detection area slightly larger than the visual hub
        const detectionWidth = this.width * 1.2;
        const detectionHeight = this.height * 1.2;
        
        return Math.abs(player.x - this.x) < detectionWidth / 2 &&
               Math.abs(player.y - this.y) < detectionHeight / 2;
    }
}