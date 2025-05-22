// Define a static utility class for handling different types of collision detection in the game
class Collision {
    // Method to check for collision between two rectangular entities using AABB technique
    static checkCollision(entity1, entity2) {
        // Simple AABB (Axis-Aligned Bounding Box) collision detection
        const left1 = entity1.x - entity1.width / 2;    // Calculate left edge of first entity
        const right1 = entity1.x + entity1.width / 2;   // Calculate right edge of first entity
        const top1 = entity1.y - entity1.height / 2;    // Calculate top edge of first entity
        const bottom1 = entity1.y + entity1.height / 2; // Calculate bottom edge of first entity
        
        const left2 = entity2.x - entity2.width / 2;    // Calculate left edge of second entity
        const right2 = entity2.x + entity2.width / 2;   // Calculate right edge of second entity
        const top2 = entity2.y - entity2.height / 2;    // Calculate top edge of second entity
        const bottom2 = entity2.y + entity2.height / 2; // Calculate bottom edge of second entity
        
        // Check if the boxes overlap by testing for non-overlapping conditions
        // Returns false if any of these conditions are true (meaning no collision)
        return !(
            right1 < left2 ||    // First entity is to the left of second entity
            left1 > right2 ||    // First entity is to the right of second entity
            bottom1 < top2 ||    // First entity is above second entity
            top1 > bottom2       // First entity is below second entity
        );
    }
    
    // Method to check for collision between two circular entities
    static checkCircleCollision(circle1, circle2) {
        // Calculate distance between circle centers using Pythagorean theorem
        const dx = circle1.x - circle2.x;           // X distance between centers
        const dy = circle1.y - circle2.y;           // Y distance between centers
        const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance between centers
        
        // Check if distance is less than sum of radii (collision occurs)
        // Assumes width property represents diameter, so divide by 2 for radius
        return distance < (circle1.width / 2 + circle2.width / 2);
    }
    
    // Method to check if a point is inside a circular entity
    static checkPointInCircle(x, y, circle) {
        // Calculate distance from point to circle center using Pythagorean theorem
        const dx = x - circle.x;                    // X distance from point to center
        const dy = y - circle.y;                    // Y distance from point to center
        const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance from point to center
        
        // Check if distance is less than radius (point is inside circle)
        // Assumes width property represents diameter, so divide by 2 for radius
        return distance < circle.width / 2;
    }
}