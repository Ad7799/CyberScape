// Define a class representing a data shard in the game - a collectible item that can be encrypted or decrypted
class Shard {
    // Constructor initializes a new shard with position and encryption state
    constructor(x, y, isEncrypted = true) {
        this.x = x;                    // X-coordinate of the shard's center
        this.y = y;                    // Y-coordinate of the shard's center
        this.width = 20;               // Width of the shard in pixels
        this.height = 20;              // Height of the shard in pixels
        this.isEncrypted = isEncrypted; // Boolean flag indicating if the shard is encrypted
        this.color = isEncrypted ? '#FF00FF' : '#00FF00'; // Purple if encrypted, green if decrypted
    }
    
    // Method to change the shard's state from encrypted to decrypted
    decrypt() {
        this.isEncrypted = false;      // Set encryption flag to false
        this.color = '#00FF00';        // Change color to green to visually indicate decryption
    }
    
    // Render method to draw the shard on the canvas
    render(ctx) {
        ctx.fillStyle = this.color;    // Set fill color based on encryption state
        
        // Draw a diamond shape to represent the shard
        ctx.beginPath();               // Start a new drawing path
        ctx.moveTo(this.x, this.y - this.height / 2);  // Start at top point of diamond
        ctx.lineTo(this.x + this.width / 2, this.y);   // Draw line to right point
        ctx.lineTo(this.x, this.y + this.height / 2);  // Draw line to bottom point
        ctx.lineTo(this.x - this.width / 2, this.y);   // Draw line to left point
        ctx.closePath();               // Close the path to complete the diamond shape
        ctx.fill();                    // Fill the diamond with the appropriate color
    }
}