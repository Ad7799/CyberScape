# CyberScape
## Game Overview
CyberScape is a top-down 2D cyberpunk-themed action game where players navigate a digital landscape to restore a failing system. As a digital agent, your mission is to collect data shards, decrypt them, and deliver them to the base station while avoiding security towers and other hazards.

## Gameplay
### Core Mechanics
- <strong>System Health</strong> : The system starts at 50% health and continuously deteriorates. Your goal is to restore it to 100% before it reaches 0%.
- <strong>Player Movement</strong> : Navigate using WASD or arrow keys through a procedurally generated map.
- <strong>Combat</strong> : Click to shoot projectiles that can destroy security towers.
- <strong>Collection</strong> : Gather encryption keys and data shards scattered throughout the environment.
### Key Locations
- <strong>Central Hub</strong> : Located on the left side of the map, this is where you decrypt data shards using collected keys.
- <strong>Base Station</strong> : Located on the right side of the map, deliver decrypted shards here to restore system health.
### Entities
- <strong>Security Towers</strong> : Enemy structures that detect and damage the player when in range.
- <strong>Keys</strong> : Collectible items required for decryption at the Central Hub.
- <strong>Data Shards</strong> : Collectible items that must be decrypted and delivered to restore system health.
- <strong>Bullets</strong> : Projectiles fired by the player that can destroy security towers.
## Controls
- <strong>Movement</strong> : WASD or Arrow Keys
- <strong>Shoot</strong> : Left Mouse Click
- <strong>Pause</strong> : Escape Key
- <strong>Restart</strong> : R Key (when game is over)
## Game Elements
### Player
- Health: 100%
- Can collect keys and shards
- Can shoot bullets to destroy towers
### System
- Starting health: 50%
- Constantly decreases over time
- Game over when it reaches 0%
- Victory when it reaches 100%
### Items
- <strong>Keys</strong> : Required to decrypt shards (1 key per shard)
- <strong>Shards</strong> : Worth 10% system health each when delivered to the Base Station
## Technical Implementation
The game is built using vanilla JavaScript and HTML5 Canvas for rendering. The codebase is organized into modules:

- <strong>Main Game Logic</strong> : Manages game state, updates, and rendering
- <strong>Entities</strong> : Player, towers, bullets, keys, shards, and locations
- <strong>Map</strong> : Procedural generation and rendering
- <strong>UI</strong>: Heads-up display and menu system
- <strong>Utils</strong> : Collision detection, physics, and storage
## Development
CyberScape is a web-based game that runs directly in the browser. The project structure follows a modular approach with separate JavaScript files for different game components.

## How to Play
1. Open index.html in a modern web browser
2. Use WASD or arrow keys to move
3. Click to shoot at security towers
4. Collect keys (yellow items)
5. Visit the Central Hub (black square) to decrypt shards
6. Collect decrypted shards
7. Deliver shards to the Base Station (blue square) to restore system health
8. Restore system health to 100% to win!
