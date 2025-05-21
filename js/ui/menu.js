class Menu {
    static init(game) {
        this.menuElement = document.getElementById('menu');
        this.resumeButton = document.getElementById('resume-btn');
        this.restartButton = document.getElementById('restart-btn');
        
        // Add event listeners
        this.resumeButton.addEventListener('click', () => {
            game.togglePause();
        });
        
        this.restartButton.addEventListener('click', () => {
            game.restart();
            this.toggleMenu(false);
        });
    }
    
    static toggleMenu(show) {
        if (this.menuElement) {
            if (show) {
                this.menuElement.classList.remove('hidden');
            } else {
                this.menuElement.classList.add('hidden');
            }
        }
    }
    
    static showGameOver(isWin) {
        // Create or get game over element
        let gameOverElement = document.getElementById('game-over');
        
        if (!gameOverElement) {
            gameOverElement = document.createElement('div');
            gameOverElement.id = 'game-over';
            document.getElementById('game-container').appendChild(gameOverElement);
        }
        
        // Set content based on win/lose
        if (isWin) {
            gameOverElement.innerHTML = `
                <h1>You Win!</h1>
                <p>You successfully restored the system to 100%</p>
                <button id="restart-game-btn">Play Again</button>
            `;
        } else {
            gameOverElement.innerHTML = `
                <h1>Game Over</h1>
                <p>The system has failed</p>
                <button id="restart-game-btn">Try Again</button>
            `;
        }
        
        // Show the element
        gameOverElement.classList.add('visible');
        
        // Add event listener to restart button
        document.getElementById('restart-game-btn').addEventListener('click', () => {
            gameOverElement.classList.remove('visible');
            window.game.restart();
        });
    }
}