class MapGenerator {
    // Tile type constants
    static TILE_BUILDING = 0;
    static TILE_GRASS = 1;
    static TILE_ROAD = 2;
    
    static generateMap(canvasWidth, canvasHeight) {
        // Define tile size
        const tileSize = 32;
        
        // Calculate map dimensions
        const width = Math.ceil(canvasWidth / tileSize);
        const height = Math.ceil(canvasHeight / tileSize);
        
        // Initialize map with grass
        const tiles = Array(height).fill().map(() => Array(width).fill(this.TILE_GRASS));
        
        // Generate roads
        this.generateRoads(tiles, width, height);
        
        // Generate buildings
        this.generateBuildings(tiles, width, height);
        
        return {
            width,
            height,
            tileSize,
            tiles
        };
    }
    
    static generateRoads(tiles, width, height) {
        // Create a horizontal road
        const horizontalRoadY = Math.floor(height / 2);
        for (let x = 0; x < width; x++) {
            tiles[horizontalRoadY][x] = this.TILE_ROAD;
        }
        
        // Create a few vertical roads
        const roadPositions = [
            Math.floor(width / 4),
            Math.floor(width / 2),
            Math.floor(width * 3 / 4)
        ];
        
        for (const x of roadPositions) {
            for (let y = 0; y < height; y++) {
                tiles[y][x] = this.TILE_ROAD;
            }
        }
    }
    
    static generateBuildings(tiles, width, height) {
        // Generate random buildings
        const numBuildings = Math.floor(width * height * 0.1); // 10% of the map
        
        for (let i = 0; i < numBuildings; i++) {
            const buildingWidth = Math.floor(Math.random() * 3) + 2;
            const buildingHeight = Math.floor(Math.random() * 3) + 2;
            
            const startX = Math.floor(Math.random() * (width - buildingWidth));
            const startY = Math.floor(Math.random() * (height - buildingHeight));
            
            // Don't place buildings on roads
            let canPlaceBuilding = true;
            for (let y = startY; y < startY + buildingHeight; y++) {
                for (let x = startX; x < startX + buildingWidth; x++) {
                    if (tiles[y][x] === this.TILE_ROAD) {
                        canPlaceBuilding = false;
                        break;
                    }
                }
                if (!canPlaceBuilding) break;
            }
            
            // Place the building if possible
            if (canPlaceBuilding) {
                for (let y = startY; y < startY + buildingHeight; y++) {
                    for (let x = startX; x < startX + buildingWidth; x++) {
                        tiles[y][x] = this.TILE_BUILDING;
                    }
                }
            }
        }
    }
    
    static isWalkable(map, x, y) {
        // Convert pixel coordinates to tile coordinates
        const tileX = Math.floor(x / map.tileSize);
        const tileY = Math.floor(y / map.tileSize);
        
        // Check if coordinates are within map bounds
        if (tileX < 0 || tileX >= map.width || tileY < 0 || tileY >= map.height) {
            return false;
        }
        
        // Check if the tile is walkable (not a building)
        return map.tiles[tileY][tileX] !== this.TILE_BUILDING;
    }
}