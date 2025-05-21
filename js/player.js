class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 3; // Reduced from 5 to make it easier to stay in place
        this.health = 100;
        this.keys = 0;
        this.shards = 0;
        this.color = '#00FFFF'; // Cyan color for player
    }
    
    update(deltaTime, keysPressed, map) {
        // Calculate movement based on key presses
        let dx = 0;
        let dy = 0;
        
        if (keysPressed['w'] || keysPressed['ArrowUp']) dy -= this.speed;
        if (keysPressed['s'] || keysPressed['ArrowDown']) dy += this.speed;
        if (keysPressed['a'] || keysPressed['ArrowLeft']) dx -= this.speed;
        if (keysPressed['d'] || keysPressed['ArrowRight']) dx += this.speed;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const factor = 1 / Math.sqrt(2);
            dx *= factor;
            dy *= factor;
        }
        
        // Check if the new position is valid (not colliding with buildings)
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Check horizontal movement
        if (MapGenerator.isWalkable(map, newX, this.y)) {
            this.x = newX;
        }
        
        // Check vertical movement
        if (MapGenerator.isWalkable(map, this.x, newY)) {
            this.y = newY;
        }
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }
    
    collectKey() {
        this.keys++;
    }
    
    useKeys(count) {
        this.keys = Math.max(0, this.keys - count);
    }
    
    collectShard() {
        this.shards++;
    }
    
    deliverShards() {
        const shardsDelivered = this.shards;
        this.shards = 0;
        return shardsDelivered;
    }
    
    shoot(targetX, targetY, bulletArray) {
        // Calculate direction vector
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        
        // Normalize the direction vector
        const length = Math.sqrt(dx * dx + dy * dy);
        const dirX = dx / length;
        const dirY = dy / length;
        
        // Create a new bullet
        const bullet = new Bullet(this.x, this.y, dirX, dirY);
        bulletArray.push(bullet);
    }
}