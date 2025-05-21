class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.health = 100;
        this.detectionRadius = 150;
        this.detectionAngle = Math.PI / 3; // 60 degrees
        this.rotationSpeed = Math.PI / 4; // 45 degrees per second
        this.currentAngle = Math.random() * Math.PI * 2; // Random starting angle
        this.color = '#FF0000'; // Red for towers
    }
    
    update(deltaTime) {
        // Rotate the detection cone
        this.currentAngle += this.rotationSpeed * deltaTime / 1000;
        
        // Keep angle between 0 and 2π
        if (this.currentAngle >= Math.PI * 2) {
            this.currentAngle -= Math.PI * 2;
        }
    }
    
    render(ctx) {
        // Draw the tower
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Draw the detection cone
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Transparent red
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.detectionRadius, 
                this.currentAngle - this.detectionAngle / 2, 
                this.currentAngle + this.detectionAngle / 2);
        ctx.closePath();
        ctx.fill();
    }
    
    isPlayerDetected(player) {
        // Calculate distance to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if player is within detection radius
        if (distance <= this.detectionRadius) {
            // Calculate angle to player
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += Math.PI * 2;
            
            // Calculate the difference between the current angle and the angle to the player
            let angleDiff = Math.abs(this.currentAngle - angle);
            if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
            
            // Check if player is within detection angle
            return angleDiff <= this.detectionAngle / 2;
        }
        
        return false;
    }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }
}