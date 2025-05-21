// Initialize the game when the page loads
window.addEventListener('load', () => {
    // Create the game instance
    window.game = new Game();
    
    // Initialize the game
    window.game.init();
    
    // Initialize the menu
    Menu.init(window.game);
    
    // Add event listeners
    window.addEventListener('keydown', (e) => window.game.handleKeyDown(e));
    window.addEventListener('keyup', (e) => window.game.handleKeyUp(e));
    window.addEventListener('mousedown', (e) => window.game.handleMouseClick(e));
    window.addEventListener('resize', () => window.game.handleResize());
    
    // Check for saved game
    const savedGame = Storage.loadGameState();
    if (savedGame) {
        // Ask if player wants to continue
        if (confirm('Would you like to continue your saved game?')) {
            // Load saved game
            // Implementation would go here
        } else {
            // Clear saved game
            Storage.clearSavedGame();
        }
    }
    
    // Start the game
    window.game.start();
    
    // Show welcome message
    HUD.showMessage('Welcome to Data Shard Collection Game!', 5000);
});