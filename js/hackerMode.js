class HackerMode {
    static isEnabled = false;
    static gameRef = null;
    static powerUpInterval = null;
    static botInterval = null; // Add interval for bot generation

    static init(game) {
        this.gameRef = game;
        const hackerModeBtn = document.getElementById('hacker-mode-btn');
        if (hackerModeBtn) {
            hackerModeBtn.addEventListener('click', () => {
                this.toggleHackerMode();
            });
        }
    }

    static toggleHackerMode() {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
            HUD.showMessage('Hacker Mode Enabled! Prepare for chaos!', 3000);
            
            this.startPowerUpGeneration();
            this.startBotGeneration(); // Start bot generation
        } else {
            HUD.showMessage('Hacker Mode Disabled.', 3000);
            this.stopPowerUpGeneration();
            this.stopBotGeneration(); // Stop bot generation
        }
        // Optionally, update button text or appearance
        const hackerModeBtn = document.getElementById('hacker-mode-btn');
        if (hackerModeBtn) {
            hackerModeBtn.textContent = this.isEnabled ? 'Disable Hacker Mode' : 'Enable Hacker Mode';
        }
    }

    static startPowerUpGeneration() {
        if (this.powerUpInterval) {
            clearInterval(this.powerUpInterval);
        }
        // Generate a power-up every 5-15 seconds
        this.powerUpInterval = setInterval(() => {
            if (this.isEnabled && !this.gameRef.isPaused && !this.gameRef.isGameOver) {
                this.generateRandomPowerUp();
            }
        }, Math.random() * 10000 + 5000); // Random interval between 5 and 15 seconds
    }

    static stopPowerUpGeneration() {
        if (this.powerUpInterval) {
            clearInterval(this.powerUpInterval);
            this.powerUpInterval = null;
        }
    }

    static generateRandomPowerUp() {
        const powerUpTypes = ['speed', 'health', 'invisibility'];
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

        const x = Math.floor(Math.random() * this.gameRef.canvas.width);
        const y = Math.floor(Math.random() * this.gameRef.canvas.height);

        let powerUp = null;
        switch (randomType) {
            case 'speed':
                powerUp = new SpeedPowerUp(x, y);
                break;
            case 'health':
                powerUp = new HealthPowerUp(x, y);
                break;
            case 'invisibility':
                powerUp = new InvisibilityPowerUp(x, y);
                break;
        }

        if (powerUp) {
            this.gameRef.entities.powerUps.push(powerUp);
            HUD.showMessage(`A ${randomType} power-up appeared!`, 2000);
            // Power-up remains for 10 seconds
            setTimeout(() => {
                const index = this.gameRef.entities.powerUps.indexOf(powerUp);
                if (index > -1) {
                    this.gameRef.entities.powerUps.splice(index, 1);
                }
            }, 7000);
        }
    }

    static startBotGeneration() {
        if (this.botInterval) {
            clearInterval(this.botInterval);
        }
        // Generate a bot every 10 seconds
        this.botInterval = setInterval(() => {
            if (this.isEnabled && !this.gameRef.isPaused && !this.gameRef.isGameOver) {
                this.generateRandomBot();
            }
        }, 15000); // Changed to 10 seconds (10000 ms)
    }

    static stopBotGeneration() {
        if (this.botInterval) {
            clearInterval(this.botInterval);
            this.botInterval = null;
        }
    }

    static generateRandomBot() {
        const botTypes = ['light', 'heavy', 'sniper'];
        const randomType = botTypes[Math.floor(Math.random() * botTypes.length)];

        // Find a valid position on the map (e.g., not inside a building)
        let x, y;
        do {
            x = Math.floor(Math.random() * this.gameRef.canvas.width);
            y = Math.floor(Math.random() * this.gameRef.canvas.height);
        } while (!MapGenerator.isWalkable(this.gameRef.map, x, y));

        // Define some simple patrol routes. These could be more complex or generated dynamically.
        const patrolRoutes = [
            [{ x: x + 50, y: y }, { x: x + 50, y: y + 50 }, { x: x, y: y + 50 }, { x: x, y: y }], // Square
            [{ x: x + 100, y: y }, { x: x, y: y }], // Horizontal line
            [{ x: x, y: y + 100 }, { x: x, y: y }]  // Vertical line
        ];
        const randomPatrolRoute = patrolRoutes[Math.floor(Math.random() * patrolRoutes.length)];

        let bot = null;
        switch (randomType) {
            case 'light':
                bot = new LightBot(x, y);
                break;
            case 'heavy':
                bot = new HeavyBot(x, y);
                break;
            case 'sniper':
                bot = new SniperBot(x, y);
                break;
        }

        if (bot) {
            bot.patrolRoute = randomPatrolRoute; // Assign the patrol route
            this.gameRef.entities.bots.push(bot);
            HUD.showMessage(`A ${randomType} bot appeared!`, 2000);
        }
    }
}