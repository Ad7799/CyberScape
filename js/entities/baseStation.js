// Define a class representing a base station in the game
class BaseStation {
    // Constructor initializes a new base station with position and default properties
    constructor(x, y) {
        this.x = x;                    // X-coordinate of the base station's center
        this.y = y;                    // Y-coordinate of the base station's center
        this.width = 60;               // Width of the base station in pixels
        this.height = 60;              // Height of the base station in pixels
        this.color = '#00AA00';        // Green color for the base station
        this.uploadProgress = 0;       // Initial upload progress (0-100)
        this.uploadSpeed = 0.05;       // Upload speed: 5% per frame when normalized to 16ms
        this.isUploading = false;      // Flag to track if the station is currently uploading
    }
    
    // Update method called each frame to handle game logic
    update(deltaTime) {
        // Only process upload logic if currently uploading
        if (this.isUploading) {
            // Increase upload progress based on time elapsed (normalized to 16ms per frame)
            this.uploadProgress += this.uploadSpeed * deltaTime / 16;
            
            // Check if upload is complete (reached 100%)
            if (this.uploadProgress >= 100) {
                this.uploadProgress = 0;       // Reset progress for future uploads
                this.isUploading = false;      // Stop the uploading state
                return true;                   // Return true to signal upload completion
            }
        }
        
        return false;                          // Return false if upload is not complete
    }
    
    // Render method to draw the base station on the canvas
    render(ctx) {
        // Draw the main body of the base station as a rectangle
        ctx.fillStyle = this.color;            // Set the fill color to green
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Draw an antenna on top of the base station
        ctx.strokeStyle = '#FFFFFF';           // Set stroke color to white
        ctx.lineWidth = 3;                     // Set line width to 3 pixels
        ctx.beginPath();                       // Start a new path for drawing
        ctx.moveTo(this.x, this.y - this.height / 2);             // Start at top center of station
        ctx.lineTo(this.x, this.y - this.height / 2 - 20);        // Draw vertical line up
        ctx.lineTo(this.x + 15, this.y - this.height / 2 - 35);   // Draw diagonal line for antenna
        ctx.stroke();                          // Render the antenna path
        
        // Draw upload progress bar if the station is currently uploading
        if (this.isUploading) {
            const barWidth = this.width - 10;  // Progress bar width (slightly smaller than station)
            const barHeight = 8;               // Progress bar height in pixels
            const barX = this.x - barWidth / 2;// X position (centered below station)
            const barY = this.y + this.height / 2 + 10; // Y position (below station)
            
            // Draw progress bar background
            ctx.fillStyle = '#333333';         // Dark gray background
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Draw the actual progress indicator
            ctx.fillStyle = '#00FF00';         // Bright green for progress
            ctx.fillRect(barX, barY, barWidth * (this.uploadProgress / 100), barHeight); // Width based on progress percentage
        }
    }
    
    // Method to initiate the upload process
    startUpload() {
        this.isUploading = true;       // Set uploading state to true
        this.uploadProgress = 0;       // Reset progress to start from 0
    }
}