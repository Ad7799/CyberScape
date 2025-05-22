// Define a static utility class for managing the game's menu system
class Menu {
    // Initialize menu by getting references to DOM elements and setting up event handlers
    static init(game) {
        this.menuElement = document.getElementById('menu');           // Reference to the main menu container
        this.resumeButton = document.getElementById('resume-btn');     // Reference to the resume game button
        this.restartButton = document.getElementById('restart-btn');   // Reference to the restart game button
        
        // Set up click event handler for the resume button
        this.resumeButton.addEventListener('click', () => {
            game.togglePause();                                        // Call game's pause toggle method
        });
        
        // Set up click event handler for the restart button
        this.restartButton.addEventListener('click', () => {
            game.restart();                                            // Call game's restart method
            this.toggleMenu(false);                                    // Hide the menu after restarting
        });
    }
    
    // Method to show or hide the menu based on the provided boolean
    static toggleMenu(show) {
        if (this.menuElement) {                                        // Check if menu element exists
            if (show) {
                this.menuElement.classList.remove('hidden');           // Show menu by removing hidden class
            } else {
                this.menuElement.classList.add('hidden');              // Hide menu by adding hidden class
            }
        }
    }
    
    // Method to display the game over screen with different content based on win/lose state
    static showGameOver(isWin) {
        // Find existing game over element or create a new one if it doesn't exist
        let gameOverElement = document.getElementById('game-over');
        
        // If game over element doesn't exist, create and add it to the game container
        if (!gameOverElement) {
            gameOverElement = document.createElement('div');           // Create new div element
            gameOverElement.id = 'game-over';                          // Set its ID for future reference
            document.getElementById('game-container').appendChild(gameOverElement); // Add to game container
        }
        
        // Set different content based on whether the player won or lost
        if (isWin) {
            // HTML content for win scenario
            gameOverElement.innerHTML = `
                <h1>You Win!</h1>
                <p>You successfully restored the system to 100%</p>
                <button id="restart-game-btn">Play Again</button>
            `;
        } else {
            // HTML content for lose scenario
            gameOverElement.innerHTML = `
                <h1>Game Over</h1>
                <p>The system has failed</p>
                <button id="restart-game-btn">Try Again</button>
            `;
        }
        
        // Make the game over screen visible
        gameOverElement.classList.add('visible');
        
        // Set up click event handler for the restart button in the game over screen
        document.getElementById('restart-game-btn').addEventListener('click', () => {
            gameOverElement.classList.remove('visible');               // Hide the game over screen
            window.game.restart();                                     // Restart the game using global reference
        });
    }
}