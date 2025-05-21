class Key {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 15;
        this.color = '#FFFF00'; // Yellow for keys
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw a key shape
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - 5, this.y);
        ctx.lineTo(this.x + 5, this.y);
        ctx.moveTo(this.x, this.y - 5);
        ctx.lineTo(this.x, this.y + 5);
        ctx.stroke();
    }
}