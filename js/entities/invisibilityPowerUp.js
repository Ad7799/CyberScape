class InvisibilityPowerUp extends PowerUp {
    constructor(x, y) {
        super(x, y, 'invisibility', 'purple');
        this.duration = 7000; // 7 seconds
    }

    applyEffect(player) {
        player.isInvisible = true;
        HUD.showMessage('Invisibility Activated!', 1500);
        if(this.duration > 0) {
            setTimeout(() => {
                this.removeEffect(player);
            }, this.duration);
        }
    }

    removeEffect(player) {
        player.isInvisible = false;
        HUD.showMessage('Invisibility Expired!', 1500);
    }
}