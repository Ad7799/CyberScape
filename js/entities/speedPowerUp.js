class SpeedPowerUp extends PowerUp {
    constructor(x, y) {
        super(x, y, 'speed', 'yellow');
        this.duration = 5000; // 5 seconds
        this.speedBoost = 1.5; // 50% speed increase
    }

    applyEffect(player) {
        player.speed *= this.speedBoost;
        HUD.showMessage('Speed Boost Activated!', 1500);
        if (this.duration > 0) {
            setTimeout(() => {
                this.removeEffect(player);
            }, this.duration);
        }
    }

    removeEffect(player) {
        player.speed /= this.speedBoost;
        HUD.showMessage('Speed Boost Expired!', 1500);
    }
}