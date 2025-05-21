class Storage {
    static saveScore(score) {
        // Get existing high scores
        const highScores = this.getHighScores();
        
        // Add new score
        highScores.push({
            score: score,
            date: new Date().toISOString()
        });
        
        // Sort scores (highest first)
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        const topScores = highScores.slice(0, 10);
        
        // Save to local storage
        localStorage.setItem('dataShardGame_highScores', JSON.stringify(topScores));
        
        return topScores;
    }
    
    static getHighScores() {
        // Get scores from local storage
        const scores = localStorage.getItem('dataShardGame_highScores');
        
        // Return parsed scores or empty array if none exist
        return scores ? JSON.parse(scores) : [];
    }
    
    static saveGameState(game) {
        // Create a simplified game state to save
        const gameState = {
            playerHealth: game.player.health,
            playerX: game.player.x,
            playerY: game.player.y,
            keys: game.player.keys,
            shards: game.player.shards,
            systemHealth: game.systemHealth,
            towers: game.entities.towers.map(tower => ({
                x: tower.x,
                y: tower.y,
                health: tower.health
            }))
        };
        
        // Save to local storage
        localStorage.setItem('dataShardGame_savedGame', JSON.stringify(gameState));
    }
    
    static loadGameState() {
        // Get saved game from local storage
        const savedGame = localStorage.getItem('dataShardGame_savedGame');
        
        // Return parsed game state or null if none exists
        return savedGame ? JSON.parse(savedGame) : null;
    }
    
    static clearSavedGame() {
        // Remove saved game from local storage
        localStorage.removeItem('dataShardGame_savedGame');
    }
}