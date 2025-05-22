// Define a static utility class for generating and managing game maps
class MapGenerator {
    // Define constants for different tile types used in the map
    static TILE_BUILDING = 0;      // Constant representing building tiles (non-walkable)
    static TILE_GRASS = 1;         // Constant representing grass tiles (walkable)
    static TILE_ROAD = 2;          // Constant representing road tiles (walkable)
    
    // Main method to generate a complete game map based on canvas dimensions
    static generateMap(canvasWidth, canvasHeight) {
        // Define the size of each tile in pixels
        const tileSize = 32;
        
        // Calculate the number of tiles needed to cover the canvas
        const width = Math.ceil(canvasWidth / tileSize);    // Number of tiles horizontally
        const height = Math.ceil(canvasHeight / tileSize);  // Number of tiles vertically
        
        // Create a 2D array filled with grass tiles as the default terrain
        const tiles = Array(height).fill().map(() => Array(width).fill(this.TILE_GRASS));
        
        // Add road network to the map
        this.generateRoads(tiles, width, height);
        
        // Add buildings to the map
        this.generateBuildings(tiles, width, height);
        
        // Return the complete map object with all necessary properties
        return {
            width,              // Map width in tiles
            height,             // Map height in tiles
            tileSize,           // Size of each tile in pixels
            tiles               // 2D array containing tile data
        };
    }
    
    // Method to generate the road network on the map
    static generateRoads(tiles, width, height) {
        // Create a single horizontal road across the middle of the map
        const horizontalRoadY = Math.floor(height / 2);  // Y-coordinate for the horizontal road
        for (let x = 0; x < width; x++) {
            tiles[horizontalRoadY][x] = this.TILE_ROAD;  // Set each tile in the row to road type
        }
        
        // Define positions for three vertical roads at quarter, half, and three-quarter points
        const roadPositions = [
            Math.floor(width / 4),       // First vertical road at 1/4 of map width
            Math.floor(width / 2),       // Second vertical road at 1/2 of map width
            Math.floor(width * 3 / 4)    // Third vertical road at 3/4 of map width
        ];
        
        // Create vertical roads at each defined position
        for (const x of roadPositions) {
            for (let y = 0; y < height; y++) {
                tiles[y][x] = this.TILE_ROAD;  // Set each tile in the column to road type
            }
        }
    }
    
    // Method to generate buildings on the map
    static generateBuildings(tiles, width, height) {
        // Calculate number of buildings to generate (10% of total map area)
        const numBuildings = Math.floor(width * height * 0.1);
        
        // Generate each building with random size and position
        for (let i = 0; i < numBuildings; i++) {
            // Determine random building dimensions (2-4 tiles wide, 2-4 tiles tall)
            const buildingWidth = Math.floor(Math.random() * 3) + 2;
            const buildingHeight = Math.floor(Math.random() * 3) + 2;
            
            // Determine random starting position for the building
            const startX = Math.floor(Math.random() * (width - buildingWidth));
            const startY = Math.floor(Math.random() * (height - buildingHeight));
            
            // Check if the building would overlap with any roads
            let canPlaceBuilding = true;
            for (let y = startY; y < startY + buildingHeight; y++) {
                for (let x = startX; x < startX + buildingWidth; x++) {
                    if (tiles[y][x] === this.TILE_ROAD) {
                        canPlaceBuilding = false;  // Cannot place if any tile is a road
                        break;
                    }
                }
                if (!canPlaceBuilding) break;  // Exit early if we already found a road
            }
            
            // If no roads were found in the building area, place the building
            if (canPlaceBuilding) {
                for (let y = startY; y < startY + buildingHeight; y++) {
                    for (let x = startX; x < startX + buildingWidth; x++) {
                        tiles[y][x] = this.TILE_BUILDING;  // Set each tile to building type
                    }
                }
            }
        }
    }
    
    // Utility method to check if a pixel position is walkable (not a building)
    static isWalkable(map, x, y) {
        // Convert pixel coordinates to tile grid coordinates
        const tileX = Math.floor(x / map.tileSize);  // Get tile X index from pixel X
        const tileY = Math.floor(y / map.tileSize);  // Get tile Y index from pixel Y
        
        // Check if the coordinates are within the map boundaries
        if (tileX < 0 || tileX >= map.width || tileY < 0 || tileY >= map.height) {
            return false;  // Out of bounds positions are not walkable
        }
        
        // Return true if the tile is not a building (grass or road)
        return map.tiles[tileY][tileX] !== this.TILE_BUILDING;
    }
}