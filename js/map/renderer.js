// Define a singleton object for rendering the game map to the canvas
const MapRenderer = {
    // Method to render the entire map onto the provided canvas context
    renderMap(ctx, map) {
        // Store the tile size from the map configuration for easier access
        const tileSize = map.tileSize;
        
        // Iterate through each row of tiles in the map
        for (let y = 0; y < map.height; y++) {
            // Iterate through each column of tiles in the current row
            for (let x = 0; x < map.width; x++) {
                // Get the type of the current tile from the map data
                const tileType = map.tiles[y][x];
                
                // Determine the appropriate color based on the tile type
                switch (tileType) {
                    case MapGenerator.TILE_BUILDING:
                        ctx.fillStyle = '#000000'; // Black color for building tiles
                        break;
                    case MapGenerator.TILE_GRASS:
                        ctx.fillStyle = '#228B22'; // Forest green color for grass tiles
                        break;
                    case MapGenerator.TILE_ROAD:
                        ctx.fillStyle = '#808080'; // Gray color for road tiles
                        break;
                    default:
                        ctx.fillStyle = '#FF00FF'; // Magenta color for unknown tile types (helps with debugging)
                }
                
                // Draw the colored tile as a filled rectangle at the appropriate position
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                
                // Draw grid lines around each tile for visual clarity
                ctx.strokeStyle = '#333333';       // Dark gray color for grid lines
                ctx.lineWidth = 1;                 // Set line width to 1 pixel
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize); // Draw the grid outline
            }
        }
    }
};