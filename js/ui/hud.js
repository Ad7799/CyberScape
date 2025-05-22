// Define a static utility class for managing the game's Heads-Up Display (HUD)
class HUD {
    // Initialize HUD by getting references to DOM elements that will display game information
    static init(game) {
        this.playerHealthElement = document.getElementById('player-health');    // Reference to element showing player health
        this.systemHealthElement = document.getElementById('system-health');    // Reference to element showing system health
        this.keyCountElement = document.getElementById('key-count');            // Reference to element showing collected keys
        this.shardCountElement = document.getElementById('shard-count');        // Reference to element showing collected shards
    }
    
    // Update HUD elements with current game state information
    static update(game) {
        // Update the player health display if the element exists
        if (this.playerHealthElement) {
            this.playerHealthElement.textContent = Math.floor(game.player.health);  // Round down and display player health
        }
        
        // Update the system health display if the element exists
        if (this.systemHealthElement) {
            this.systemHealthElement.textContent = Math.floor(game.systemHealth);   // Round down and display system health
        }
        
        // Update the key count display if the element exists
        if (this.keyCountElement) {
            this.keyCountElement.textContent = game.player.keys;                    // Display number of keys player has
        }
        
        // Update the shard count display if the element exists
        if (this.shardCountElement) {
            this.shardCountElement.textContent = game.player.shards;                // Display number of shards player has
        }
    }
    
    // Display a temporary message to the player
    static showMessage(message, duration = 3000) {
        // Find existing message element or create a new one if it doesn't exist
        let messageElement = document.getElementById('game-message');
        
        // If message element doesn't exist, create and add it to the UI overlay
        if (!messageElement) {
            messageElement = document.createElement('div');                          // Create new div element
            messageElement.id = 'game-message';                                      // Set its ID for future reference
            document.getElementById('ui-overlay').appendChild(messageElement);       // Add to UI overlay container
        }
        
        // Set the message text and make it visible
        messageElement.textContent = message;                                        // Set the message content
        messageElement.classList.add('visible');                                     // Add CSS class to show the message
        
        // Automatically hide the message after the specified duration
        setTimeout(() => {
            messageElement.classList.remove('visible');                              // Remove CSS class to hide message
        }, duration);                                                                // Wait for duration milliseconds
    }
}