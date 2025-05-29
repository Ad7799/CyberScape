class HealthPowerUp extends PowerUp {
    constructor(x, y) {
        super(x, y, 'health', 'red');
        this.healthAmount = 20; // Restore 20 health
    }

    applyEffect(player) {
        player.health = Math.min(100, player.health + this.healthAmount);
        HUD.showMessage('Health Restored!', 1500);
    }

    removeEffect(player) {
        // Health power-ups have an immediate effect and no duration-based removal
    }
}