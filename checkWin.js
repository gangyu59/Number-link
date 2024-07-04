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
    // Check if the endpoints are the same
    if ((p1.row === q1.row && p1.col === q1.col) || 
        (p2.row === q2.row && p2.col === q2.col) || 
        (p1.row === q2.row && p1.col === q2.col) || 
        (p2.row === q1.row && p2.col === q1.col)) {
        return false;
    }

    // Calculate the direction of the points
    function direction(a, b, c) {
        return (b.col - a.col) * (c.row - a.row) - (b.row - a.row) * (c.col - a.col);
    }

    const d1 = direction(p1, p2, q1);
    const d2 = direction(p1, p2, q2);
    const d3 = direction(q1, q2, p1);
    const d4 = direction(q1, q2, p2);

    // General case
    if (d1 * d2 < 0 && d3 * d4 < 0) {
        return true;
    }

    // Special Cases
    // p1, p2 and q1 are collinear and q1 lies on segment p1p2
    if (d1 === 0 && onSegment(p1, p2, q1)) return false;

    // p1, p2 and q2 are collinear and q2 lies on segment p1p2
    if (d2 === 0 && onSegment(p1, p2, q2)) return false;

    // q1, q2 and p1 are collinear and p1 lies on segment q1q2
    if (d3 === 0 && onSegment(q1, q2, p1)) return false;

    // q1, q2 and p2 are collinear and p2 lies on segment q1q2
    if (d4 === 0 && onSegment(q1, q2, p2)) return false;

    return false;
}

function onSegment(p, q, r) {
    if (r.col <= Math.max(p.col, q.col) && r.col >= Math.min(p.col, q.col) &&
        r.row <= Math.max(p.row, q.row) && r.row >= Math.min(p.row, q.row)) {
        return true;
    }
    return false;
}