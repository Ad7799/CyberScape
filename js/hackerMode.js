class HackerMode {
    static isEnabled = false;
    static gameRef = null;
    static powerUpInterval = null;

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
        } else {
            HUD.showMessage('Hacker Mode Disabled.', 3000);
            this.stopPowerUpGeneration();
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
            }, 10000);
        }
    }
}