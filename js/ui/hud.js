class HUD {
    static init(game) {
        this.playerHealthElement = document.getElementById('player-health');
        this.systemHealthElement = document.getElementById('system-health');
        this.keyCountElement = document.getElementById('key-count');
        this.shardCountElement = document.getElementById('shard-count');
    }
    
    static update(game) {
        // Update player health
        if (this.playerHealthElement) {
            this.playerHealthElement.textContent = Math.floor(game.player.health);
        }
        
        // Update system health
        if (this.systemHealthElement) {
            this.systemHealthElement.textContent = Math.floor(game.systemHealth);
        }
        
        // Update key count
        if (this.keyCountElement) {
            this.keyCountElement.textContent = game.player.keys;
        }
        
        // Update shard count
        if (this.shardCountElement) {
            this.shardCountElement.textContent = game.player.shards;
        }
    }
    
    static showMessage(message, duration = 3000) {
        // Create or get message element
        let messageElement = document.getElementById('game-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'game-message';
            document.getElementById('ui-overlay').appendChild(messageElement);
        }
        
        // Set message and show
        messageElement.textContent = message;
        messageElement.classList.add('visible');
        
        // Hide after duration
        setTimeout(() => {
            messageElement.classList.remove('visible');
        }, duration);
    }
}