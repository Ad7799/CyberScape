// Define a static utility class for handling physics calculations and movement in the game
class Physics {
    // Method to apply a force to an entity, changing its velocity
    static applyForce(entity, forceX, forceY) {
        // If entity doesn't have velocity properties, initialize them to zero
        if (!entity.velocityX) entity.velocityX = 0;  // Initialize X velocity if not present
        if (!entity.velocityY) entity.velocityY = 0;  // Initialize Y velocity if not present
        
        // Apply force to change velocity (F = ma, assuming mass = 1, so F = a)
        entity.velocityX += forceX;  // Add X component of force to X velocity
        entity.velocityY += forceY;  // Add Y component of force to Y velocity
    }
    
    // Method to apply friction to slow down an entity's movement
    static applyFriction(entity, frictionCoefficient) {
        // If entity has no velocity in either direction, nothing to do
        if (!entity.velocityX && !entity.velocityY) return;
        
        // Apply friction by reducing velocity by a percentage each frame
        entity.velocityX *= (1 - frictionCoefficient);  // Reduce X velocity by friction factor
        entity.velocityY *= (1 - frictionCoefficient);  // Reduce Y velocity by friction factor
        
        // Stop very small movements to prevent floating point precision issues
        if (Math.abs(entity.velocityX) < 0.01) entity.velocityX = 0;  // Zero out tiny X velocities
        if (Math.abs(entity.velocityY) < 0.01) entity.velocityY = 0;  // Zero out tiny Y velocities
    }
    
    // Method to update an entity's position based on its velocity and elapsed time
    static updatePosition(entity, deltaTime) {
        // If entity has no velocity in either direction, nothing to do
        if (!entity.velocityX && !entity.velocityY) return;
        
        // Update position based on velocity and time (normalizing to 16ms frame time)
        entity.x += entity.velocityX * (deltaTime / 16);  // Move in X direction based on time
        entity.y += entity.velocityY * (deltaTime / 16);  // Move in Y direction based on time
    }
    
    // Method to calculate the angle between two points (in radians)
    static calculateAngle(x1, y1, x2, y2) {
        // Calculate angle using arctangent function (returns angle in radians)
        return Math.atan2(y2 - y1, x2 - x1);  // atan2 handles quadrant determination automatically
    }
    
    // Method to calculate the distance between two points
    static calculateDistance(x1, y1, x2, y2) {
        // Calculate the difference in coordinates
        const dx = x2 - x1;  // X distance between points
        const dy = y2 - y1;  // Y distance between points
        // Use Pythagorean theorem to find distance
        return Math.sqrt(dx * dx + dy * dy);  // Square root of sum of squared differences
    }
}