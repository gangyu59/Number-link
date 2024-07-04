function checkWinCondition(grid, lines, totalPairs) {
    const gridSize = grid.length;

    // Check if all pairs are connected
    if (lines.length !== totalPairs) return false;

    // Create a grid to track coverage
    const coverageGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

    // Fill the coverageGrid based on lines
    lines.forEach(line => {
        line.path.forEach(node => {
            coverageGrid[node.row][node.col] = true;
        });
    });

    // Check if all cells are covered
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!coverageGrid[row][col]) return false;
        }
    }

    // Check if all pairs are correctly connected
    for (let line of lines) {
        const startNode = line.path[0];
        const endNode = line.path[line.path.length - 1];
        if (grid[startNode.row][startNode.col] !== grid[endNode.row][endNode.col]) {
            return false;
        }
    }

    // Check for crossing lines (allowed to overlap but not cross)
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            const line1 = lines[i].path;
            const line2 = lines[j].path;

            // Check for actual crossing, not just overlapping
            for (let k = 1; k < line1.length; k++) {
                for (let l = 1; l < line2.length; l++) {
                    if (doLinesCross(line1[k - 1], line1[k], line2[l - 1], line2[l])) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

function doLinesCross(p1, p2, q1, q2) {
    const det = (p2.row - p1.row) * (q2.col - q1.col) - (p2.col - p1.col) * (q2.row - q1.row);
    if (det === 0) return false; // parallel lines

    const lambda = ((q2.col - q1.col) * (q2.row - p1.row) + (q1.row - q2.row) * (q2.col - p1.col)) / det;
    const gamma = ((p1.col - p2.col) * (q2.row - p1.row) + (p2.row - p1.row) * (q2.col - p1.col)) / det;

    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
}