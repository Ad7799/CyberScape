const MapRenderer = {
    renderMap(ctx, map) {
        const tileSize = map.tileSize;
        
        // Render each tile
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tileType = map.tiles[y][x];
                
                // Set the color based on tile type
                switch (tileType) {
                    case MapGenerator.TILE_BUILDING:
                        ctx.fillStyle = '#000000'; // Black for buildings
                        break;
                    case MapGenerator.TILE_GRASS:
                        ctx.fillStyle = '#228B22'; // Forest green for grass
                        break;
                    case MapGenerator.TILE_ROAD:
                        ctx.fillStyle = '#808080'; // Gray for roads
                        break;
                    default:
                        ctx.fillStyle = '#FF00FF'; // Magenta for unknown tiles (debugging)
                }
                
                // Draw the tile
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                
                // Draw grid lines
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
};