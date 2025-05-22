// Define a class representing a collectible key in the game
class Key {
    // Constructor initializes a new key with position and default properties
    constructor(x, y) {
        this.x = x;                    // X-coordinate of the key's center
        this.y = y;                    // Y-coordinate of the key's center
        this.width = 15;               // Width of the key in pixels
        this.height = 15;              // Height of the key in pixels
        this.color = '#FFFF00';        // Yellow color for keys
    }
    
    // Render method to draw the key on the canvas
    render(ctx) {
        // Draw the main body of the key as a yellow circle
        ctx.fillStyle = this.color;            // Set fill color to yellow
        ctx.beginPath();                       // Start a new drawing path
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);  // Create a full circle
        ctx.fill();                            // Fill the circle
        
        // Draw a simple cross/plus shape inside the circle to represent a key
        ctx.strokeStyle = '#000000';           // Set stroke color to black
        ctx.lineWidth = 2;                     // Set line width to 2 pixels
        ctx.beginPath();                       // Start a new drawing path
        ctx.moveTo(this.x - 5, this.y);        // Start at left of center
        ctx.lineTo(this.x + 5, this.y);        // Draw horizontal line
        ctx.moveTo(this.x, this.y - 5);        // Move to top of center
        ctx.lineTo(this.x, this.y + 5);        // Draw vertical line
        ctx.stroke();                          // Render the key shape
    }
}