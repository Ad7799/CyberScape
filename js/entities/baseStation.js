class BaseStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.color = '#00AA00'; // Green for base station
        this.uploadProgress = 0;
        this.uploadSpeed = 0.05; // 5% per frame when a shard is being uploaded
        this.isUploading = false;
    }
    
    update(deltaTime) {
        // Update upload progress if uploading
        if (this.isUploading) {
            this.uploadProgress += this.uploadSpeed * deltaTime / 16;
            
            if (this.uploadProgress >= 100) {
                this.uploadProgress = 0;
                this.isUploading = false;
                return true; // Upload complete
            }
        }
        
        return false;
    }
    
    render(ctx) {
        // Draw the base station
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Draw antenna
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.height / 2);
        ctx.lineTo(this.x, this.y - this.height / 2 - 20);
        ctx.lineTo(this.x + 15, this.y - this.height / 2 - 35);
        ctx.stroke();
        
        // Draw upload progress bar if uploading
        if (this.isUploading) {
            const barWidth = this.width - 10;
            const barHeight = 8;
            const barX = this.x - barWidth / 2;
            const barY = this.y + this.height / 2 + 10;
            
            // Background
            ctx.fillStyle = '#333333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Progress
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(barX, barY, barWidth * (this.uploadProgress / 100), barHeight);
        }
    }
    
    startUpload() {
        this.isUploading = true;
        this.uploadProgress = 0;
    }
}