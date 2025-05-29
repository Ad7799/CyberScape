class PowerUp {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.color = color;
        this.duration = 0; // 0 means permanent effect
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.fillText(this.type.charAt(0).toUpperCase(), this.x + 5, this.y + 15);
    }

    applyEffect(player) {
        // This method will be overridden by specific power-up types
        console.log(`Applying ${this.type} effect to player.`);
        if(this.duration > 0) {
            setTimeout(() => {
                this.removeEffect(player);
            }, this.duration);
        }
    }

    removeEffect(player) {
        // This method will be overridden by specific power-up types
        console.log(`Removing ${this.type} effect from player.`);
    }
}