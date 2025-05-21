class Physics {
    static applyForce(entity, forceX, forceY) {
        // If entity doesn't have velocity, initialize it
        if (!entity.velocityX) entity.velocityX = 0;
        if (!entity.velocityY) entity.velocityY = 0;
        
        // Apply force (assuming mass of 1)
        entity.velocityX += forceX;
        entity.velocityY += forceY;
    }
    
    static applyFriction(entity, frictionCoefficient) {
        // If entity doesn't have velocity, nothing to do
        if (!entity.velocityX && !entity.velocityY) return;
        
        // Apply friction to slow down movement
        entity.velocityX *= (1 - frictionCoefficient);
        entity.velocityY *= (1 - frictionCoefficient);
        
        // Stop very small movements to prevent floating point issues
        if (Math.abs(entity.velocityX) < 0.01) entity.velocityX = 0;
        if (Math.abs(entity.velocityY) < 0.01) entity.velocityY = 0;
    }
    
    static updatePosition(entity, deltaTime) {
        // If entity doesn't have velocity, nothing to do
        if (!entity.velocityX && !entity.velocityY) return;
        
        // Update position based on velocity and time
        entity.x += entity.velocityX * (deltaTime / 16);
        entity.y += entity.velocityY * (deltaTime / 16);
    }
    
    static calculateAngle(x1, y1, x2, y2) {
        // Calculate angle between two points
        return Math.atan2(y2 - y1, x2 - x1);
    }
    
    static calculateDistance(x1, y1, x2, y2) {
        // Calculate distance between two points
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
}