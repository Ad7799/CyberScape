// Define a class representing a bullet projectile in the game
class Bullet {
    // Constructor initializes a new bullet with position and direction vectors
    constructor(x, y, dirX, dirY, isPlayerBullet = false, damage = 25) {
        this.x = x;                // X-coordinate of the bullet's position
        this.y = y;                // Y-coordinate of the bullet's position
        this.width = 5;            // Width of the bullet in pixels
        this.height = 5;           // Height of the bullet in pixels
        this.dirX = dirX;          // X component of direction vector (normalized)
        this.dirY = dirY;          // Y component of direction vector (normalized)
        this.speed = 10;           // Movement speed in pixels per frame
        this.damage = damage; // Use the passed damage value
        this.bounces = 0;          // Counter for number of wall bounces
        this.maxBounces = 3;       // Maximum number of bounces before bullet disappears
        this.color = '#FFFFFF';    // White color for the bullet
        this.isPlayerBullet = isPlayerBullet; // Flag to indicate if the bullet was shot by the player
    }
    
    // Update method called each frame to handle bullet movement and collisions
    update(deltaTime, map) {
        // Calculate movement distance based on direction and speed
        const moveX = this.dirX * this.speed;  // Horizontal movement amount
        const moveY = this.dirY * this.speed;  // Vertical movement amount
        
        // Calculate potential new position after movement
        const newX = this.x + moveX;  // Potential new X position
        const newY = this.y + moveY;  // Potential new Y position
        
        // Check for horizontal collision with walls
        if (!MapGenerator.isWalkable(map, newX, this.y)) {
            this.dirX *= -1;           // Reverse horizontal direction (bounce)
            this.bounces++;            // Increment bounce counter
            this.speed *= 0.8;         // Reduce speed by 20% after bounce
        } else {
            this.x = newX;             // If no collision, update X position
        }
        
        // Check for vertical collision with walls
        if (!MapGenerator.isWalkable(map, this.x, newY)) {
            this.dirY *= -1;           // Reverse vertical direction (bounce)
            this.bounces++;            // Increment bounce counter
            this.speed *= 0.8;         // Reduce speed by 20% after bounce
        } else {
            this.y = newY;             // If no collision, update Y position
        }
    }
    
    // Render method to draw the bullet on the canvas
    render(ctx) {
        // Draw the bullet as a circle
        ctx.fillStyle = this.color;                    // Set fill color to white
        ctx.beginPath();                               // Start a new drawing path
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);  // Create a full circle
        ctx.fill();                                    // Fill the circle
        
        // Draw a trailing effect behind the bullet
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';  // Semi-transparent white
        ctx.lineWidth = 2;                             // Set line width to 2 pixels
        ctx.beginPath();                               // Start a new drawing path
        ctx.moveTo(this.x, this.y);                    // Start at bullet's current position
        ctx.lineTo(this.x - this.dirX * 10, this.y - this.dirY * 10);  // Draw line in opposite direction of movement
        ctx.stroke();                                  // Render the trail line
    }
}