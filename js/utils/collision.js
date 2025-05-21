class Collision {
    static checkCollision(entity1, entity2) {
        // Simple AABB (Axis-Aligned Bounding Box) collision detection
        const left1 = entity1.x - entity1.width / 2;
        const right1 = entity1.x + entity1.width / 2;
        const top1 = entity1.y - entity1.height / 2;
        const bottom1 = entity1.y + entity1.height / 2;
        
        const left2 = entity2.x - entity2.width / 2;
        const right2 = entity2.x + entity2.width / 2;
        const top2 = entity2.y - entity2.height / 2;
        const bottom2 = entity2.y + entity2.height / 2;
        
        // Check if the boxes overlap
        return !(
            right1 < left2 ||
            left1 > right2 ||
            bottom1 < top2 ||
            top1 > bottom2
        );
    }
    
    static checkCircleCollision(circle1, circle2) {
        // Calculate distance between circle centers
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if distance is less than sum of radii
        return distance < (circle1.width / 2 + circle2.width / 2);
    }
    
    static checkPointInCircle(x, y, circle) {
        // Calculate distance from point to circle center
        const dx = x - circle.x;
        const dy = y - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if distance is less than radius
        return distance < circle.width / 2;
    }
}