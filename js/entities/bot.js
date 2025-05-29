class Bot {
    constructor(x, y, type, color, health, speed, detectionRange, shootingRange) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.color = color;
        this.health = health;
        this.speed = speed;
        this.detectionRange = detectionRange;
        this.shootingRange = shootingRange;
        this.isChasing = false;
        this.patrolRoute = []; // To be defined by specific bot types or map
        this.currentPatrolIndex = 0;
        this.shootCooldown = 2000; // 2 second cooldown
        this.lastShotTime = 0;
        this.damage = 5; // Default damage, will be overridden by specific bot types

        // Set damage based on bot type
        switch (type) {
            case 'light':
                this.damage = 5;
                break;
            case 'heavy':
                this.damage = 10;
                break;
            case 'sniper':
                this.damage = 15;
                break;
            default:
                this.damage = 5;
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fillText(this.type.charAt(0).toUpperCase(), this.x + 5, this.y + 15);
    }

    update(player, map) {
        // Bot AI logic: patrol, detect, chase, shoot
        if (this.isChasing) {
            this.chasePlayer(player, map);
        } else {
            this.patrol(map);
        }

        if (this.isPlayerDetected(player)) {
            this.isChasing = true;
        } else if (this.isChasing) {
            this.isChasing = false;
        }

        if (this.isPlayerInShootingRange(player) && this.isChasing) { // Only shoot if chasing and in range
            const bullet = this.shoot(player);
            if (bullet) {
                // Assuming 'game' is accessible globally or passed around
                // You might need to add bullets to a global bullets array in game.js
                // For now, just return the bullet, and game.js will handle adding it.
                // Example: game.addBullet(bullet);
            }
        }
    }

    patrol(map) {
        // If no patrol route is defined, do nothing
        if (this.patrolRoute.length === 0) {
            return;
        }

        const targetPoint = this.patrolRoute[this.currentPatrolIndex];
        const dx = targetPoint.x - this.x;
        const dy = targetPoint.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            // Reached the current patrol point, move to the next
            this.x = targetPoint.x;
            this.y = targetPoint.y;
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolRoute.length;
        } else {
            // Move towards the target point
            const normalizedDirX = dx / distance;
            const normalizedDirY = dy / distance;
            this.x += normalizedDirX * this.speed;
            this.y += normalizedDirY * this.speed;
        }
    }

    chasePlayer(player, map) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const normalizedDirX = dx / distance;
            const normalizedDirY = dy / distance;
            this.x += normalizedDirX * this.speed;
            this.y += normalizedDirY * this.speed;
        }
    }

    shoot(player) {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime < this.shootCooldown) {
            return null; // Still on cooldown
        }

        // Calculate direction towards player
        const dirX = player.x - this.x;
        const dirY = player.y - this.y;
        const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
        const normalizedDirX = dirX / magnitude;
        const normalizedDirY = dirY / magnitude;

        // Create a new bullet instance, passing the bot's damage
        const bullet = new Bullet(this.x, this.y, normalizedDirX, normalizedDirY, false, this.damage);
        this.lastShotTime = currentTime;
        return bullet;
    }

    isPlayerDetected(player) {
        const distance = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
        return distance <= this.detectionRange;
    }

    isPlayerInShootingRange(player) {
        const distance = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
        return distance <= this.shootingRange;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            console.log(`${this.type} bot destroyed!`);
            return true; // Bot is destroyed
        }
        return false; // Bot is still alive
    }
}