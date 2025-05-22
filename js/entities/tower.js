// Define a class representing an enemy tower in the game - a security element that can detect the player
class Tower {
    // Constructor initializes a new tower with position and default properties
    constructor(x, y) {
        this.x = x;                        // X-coordinate of the tower's center
        this.y = y;                        // Y-coordinate of the tower's center
        this.width = 30;                   // Width of the tower in pixels
        this.height = 30;                  // Height of the tower in pixels
        this.health = 100;                 // Tower's health points
        this.detectionRadius = 150;        // Radius of the detection area in pixels
        this.detectionAngle = Math.PI / 3; // 60 degrees field of view for detection
        this.rotationSpeed = Math.PI / 4;  // 45 degrees rotation per second
        this.currentAngle = Math.random() * Math.PI * 2; // Random starting angle between 0 and 2π
        this.color = '#FF0000';            // Red color for towers
    }
    
    // Update method called each frame to handle tower rotation
    update(deltaTime) {
        // Rotate the detection cone based on elapsed time
        this.currentAngle += this.rotationSpeed * deltaTime / 1000;
        
        // Keep angle between 0 and 2π (wrap around when exceeding 2π)
        if (this.currentAngle >= Math.PI * 2) {
            this.currentAngle -= Math.PI * 2;
        }
    }
    
    // Render method to draw the tower on the canvas
    render(ctx) {
        // Draw the main body of the tower as a red square
        ctx.fillStyle = this.color;        // Set fill color to red
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Draw the detection cone as a semi-transparent red sector
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Transparent red for visibility
        ctx.beginPath();                   // Start a new drawing path
        ctx.moveTo(this.x, this.y);        // Start at tower's center
        ctx.arc(this.x, this.y, this.detectionRadius, 
                this.currentAngle - this.detectionAngle / 2,  // Start angle of the arc
                this.currentAngle + this.detectionAngle / 2); // End angle of the arc
        ctx.closePath();                   // Close the path to form a sector
        ctx.fill();                        // Fill the detection cone
    }
    
    // Method to check if the player is within the tower's detection area
    isPlayerDetected(player) {
        // Calculate distance between tower and player using Pythagorean theorem
        const dx = player.x - this.x;      // X distance
        const dy = player.y - this.y;      // Y distance
        const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance
        
        // First check: Is player within the detection radius?
        if (distance <= this.detectionRadius) {
            // Calculate angle to player using arctangent function
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += Math.PI * 2; // Convert negative angles to positive (0 to 2π range)
            
            // Calculate the angular difference between tower's facing direction and player position
            let angleDiff = Math.abs(this.currentAngle - angle);
            // Adjust for the shortest arc (handle the case when difference is greater than π)
            if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
            
            // Second check: Is player within the detection angle (field of view)?
            return angleDiff <= this.detectionAngle / 2;
        }
        
        // Player is outside detection radius
        return false;
    }
    
    // Method to reduce tower's health when damaged
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount); // Reduce health but not below zero
    }
}