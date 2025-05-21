class Shard {
    constructor(x, y, isEncrypted = true) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.isEncrypted = isEncrypted;
        this.color = isEncrypted ? '#FF00FF' : '#00FF00'; // Purple if encrypted, green if decrypted
    }
    
    decrypt() {
        this.isEncrypted = false;
        this.color = '#00FF00'; // Green for decrypted shards
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        
        // Draw a diamond shape
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x - this.width / 2, this.y);
        ctx.closePath();
        ctx.fill();
    }
}