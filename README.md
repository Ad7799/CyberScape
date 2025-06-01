# CyberScape

## Game Overview
CyberScape is a top-down 2D cyberpunk-themed action game where players navigate a digital landscape to restore a failing system. As a digital agent, your mission is to collect data shards, decrypt them, and battle enemy defenses to save cyberspace.

## New! Hacker Mode
**Hacker Mode** introduces new challenges and gameplay elements to CyberScape: press the (esc) button to enable.

### Enemy Bots
- **Bots spawn at random locations across the map.**
- There are 3 types of enemy bots:
  - **Light Bots**: Agile, low health, deal low damage.
  - **Heavy Bots**: Slower, high health, deal higher damage.
  - **Sniper Bots**: Attack from long range, deal damage from afar.

### Power-Ups
- **Random power-ups spawn at random locations.**
- There are 3 types of power-ups:
  - **Speed Boost**: Increases your movement speed by 50%.
  - **Health Pack**: Restores 20 health points.
  - **Invisibility**: Makes you undetectable in red zones and invisible to enemy bots for a limited time.

---

## Gameplay

### Core Mechanics
- **System Health** : The system starts at 50% health and continuously deteriorates. Your goal is to restore it to 100% before it reaches 0%.
- **Player Movement** : Navigate using WASD or arrow keys through a procedurally generated map.
- **Combat** : Click to shoot projectiles that can destroy security towers and fight bots.
- **Collection** : Gather encryption keys and data shards scattered throughout the environment. Collect power-ups in Hacker Mode.

### Key Locations
- **Central Hub** : Located on the left side of the map, this is where you decrypt data shards using collected keys.
- **Base Station** : Located on the right side of the map, deliver decrypted shards here to restore system health.

### Entities
- **Security Towers** : Enemy structures that detect and damage the player when in range.
- **Keys** : Collectible items required for decryption at the Central Hub.
- **Data Shards** : Collectible items that must be decrypted and delivered to restore system health.
- **Bullets** : Projectiles fired by the player that can destroy security towers and bots.
- **Enemy Bots (Hacker Mode)**: Light, Heavy, and Sniper bots with unique behaviors.
- **Power-Ups (Hacker Mode)**: Speed Boost, Health Pack, Invisibility.

## Controls
- **Movement** : WASD or Arrow Keys
- **Shoot** : Left Mouse Click
- **Pause** : Escape Key
- **Restart** : R Key (when game is over)

## Game Elements

### Player
- Health: 100%
- Can collect keys, shards, and power-ups
- Can shoot bullets to destroy towers and bots

### System
- Starting health: 50%
- Constantly decreases over time
- Game over when it reaches 0%
- Victory when it reaches 100%

### Items
- **Keys** : Required to decrypt shards (1 key per shard)
- **Shards** : Worth 10% system health each when delivered to the Base Station

### Hacker Mode (Summary)
- Enemy bots spawn randomly (Light, Heavy, Sniper)
- Power-ups spawn randomly (Speed Boost, Health Pack, Invisibility)
- New strategic elements and challenges

## Technical Implementation
The game is built using vanilla JavaScript and HTML5 Canvas for rendering. The codebase is organized into modules:

- **Main Game Logic** : Manages game state, updates, and rendering
- **Entities** : Player, towers, bots, bullets, keys, shards, power-ups, and locations
- **Map** : Procedural generation and rendering
- **UI**: Heads-up display and menu system
- **Utils** : Collision detection, physics, and storage

## Development
CyberScape is a web-based game that runs directly in the browser. The project structure follows a modular approach with separate JavaScript files for different game components.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/adarshhinsodiya/CyberScape.git
    ```
2. Open the project directory:
    ```bash
    cd CyberScape
    ```
3. Open `index.html` in your browser.

## How to Play
1. Open index.html in a modern web browser
2. Use WASD or arrow keys to move
3. Click to shoot at security towers and bots
4. Collect keys (yellow items)
5. Collect power-ups (in Hacker Mode)
6. Visit the Central Hub (black square) to decrypt shards
7. Collect decrypted shards
8. Deliver shards to the Base Station (blue square) to restore system health
9. Restore system health to 100% to win!
