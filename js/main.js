// Initialize the game when the page loads - this is the entry point for the entire application
window.addEventListener('load', () => {
    // Create the game instance and store it in the global window object for access from other components
    window.game = new Game();
    
    // Initialize the game by setting up the map, player, entities, and other game elements
    window.game.init();
    
    // Initialize the menu system with a reference to the game instance
    Menu.init(window.game);

    HackerMode.init(window.game);
    
    // Add event listeners to handle user input
    window.addEventListener('keydown', (e) => window.game.handleKeyDown(e));  // Handle key press events
    window.addEventListener('keyup', (e) => window.game.handleKeyUp(e));      // Handle key release events
    window.addEventListener('mousedown', (e) => window.game.handleMouseClick(e)); // Handle mouse clicks for shooting
    window.addEventListener('resize', () => window.game.handleResize());      // Handle window resize to adjust canvas
    
    // Check if there's a previously saved game state in local storage
    const savedGame = Storage.loadGameState();
    if (savedGame) {
        // If a saved game exists, ask the player if they want to continue
        if (confirm('Would you like to continue your saved game?')) {
            // Load saved game state (implementation placeholder)
            // Implementation would go here
        } else {
            // If player chooses not to continue, clear the saved game data
            Storage.clearSavedGame();
        }
    }
    
    // Start the game loop and system health decay
    window.game.start();
    
    // Show a welcome message to the player for 5 seconds
    HUD.showMessage('Welcome to CyberScape!', 5000);
});