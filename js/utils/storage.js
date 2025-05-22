// Define a static utility class for managing game data persistence using localStorage
class Storage {
    // Method to save a new score to the high scores list
    static saveScore(score) {
        // Retrieve the existing high scores from storage
        const highScores = this.getHighScores();
        
        // Add the new score with current timestamp to the scores array
        highScores.push({
            score: score,                  // The numeric score value
            date: new Date().toISOString() // Current date/time in ISO format for sorting/display
        });
        
        // Sort the scores in descending order (highest scores first)
        highScores.sort((a, b) => b.score - a.score);
        
        // Limit the list to only keep the top 10 scores
        const topScores = highScores.slice(0, 10);
        
        // Save the updated scores list back to localStorage as a JSON string
        localStorage.setItem('dataShardGame_highScores', JSON.stringify(topScores));
        
        // Return the updated top scores array for immediate use
        return topScores;
    }
    
    // Method to retrieve the current high scores from storage
    static getHighScores() {
        // Attempt to retrieve the scores string from localStorage
        const scores = localStorage.getItem('dataShardGame_highScores');
        
        // If scores exist, parse the JSON string; otherwise return an empty array
        return scores ? JSON.parse(scores) : [];
    }
    
    // Method to save the current game state for later resumption
    static saveGameState(game) {
        // Create a simplified object containing only the essential game state data
        const gameState = {
            playerHealth: game.player.health,    // Current player health
            playerX: game.player.x,              // Player's X position
            playerY: game.player.y,              // Player's Y position
            keys: game.player.keys,              // Number of keys player has collected
            shards: game.player.shards,          // Number of shards player has collected
            systemHealth: game.systemHealth,      // Current system health value
            towers: game.entities.towers.map(tower => ({  // Array of simplified tower data
                x: tower.x,                      // Tower's X position
                y: tower.y,                      // Tower's Y position
                health: tower.health             // Tower's current health
            }))
        };
        
        // Save the game state object to localStorage as a JSON string
        localStorage.setItem('dataShardGame_savedGame', JSON.stringify(gameState));
    }
    
    // Method to load a previously saved game state
    static loadGameState() {
        // Attempt to retrieve the saved game string from localStorage
        const savedGame = localStorage.getItem('dataShardGame_savedGame');
        
        // If a saved game exists, parse the JSON string; otherwise return null
        return savedGame ? JSON.parse(savedGame) : null;
    }
    
    // Method to delete the saved game data
    static clearSavedGame() {
        // Remove the saved game entry from localStorage
        localStorage.removeItem('dataShardGame_savedGame');
    }
}