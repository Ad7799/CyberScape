class Bullet {
    constructor(x, y, dirX, dirY) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 5;
        this.dirX = dirX;
        this.dirY = dirY;
        this.speed = 10;
        this.damage = 25;
        this.bounces = 0;
        this.maxBounces = 3;
        this.color = '#FFFFFF'; // White for bullets
    }
    
    update(deltaTime, map) {
        // Move the bullet
        const moveX = this.dirX * this.speed;
        const moveY = this.dirY * this.speed;
        
        // Check for collisions with walls
        const newX = this.x + moveX;
        const newY = this.y + moveY;
        
        // Handle horizontal collision
        if (!MapGenerator.isWalkable(map, newX, this.y)) {
            this.dirX *= -1; // Reverse horizontal direction
            this.bounces++;
            this.speed *= 0.8; // Reduce speed after bounce
        } else {
            this.x = newX;
        }
        
        // Handle vertical collision
        if (!MapGenerator.isWalkable(map, this.x, newY)) {
            this.dirY *= -1; // Reverse vertical direction
            this.bounces++;
            this.speed *= 0.8; // Reduce speed after bounce
        } else {
            this.y = newY;
        }
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw a trail
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.dirX * 10, this.y - this.dirY * 10);
        ctx.stroke();
    }
}