function drawGrid(ctx, gridSize, cellSize, lines, grid, currentLine, colors, colorIndex) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";

    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, ctx.canvas.height);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(ctx.canvas.width, i * cellSize);
        ctx.stroke();
    }

    lines.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = cellSize * 0.4;
        ctx.lineCap = "round";
        line.path.forEach((point, index) => {
            const { row, col } = point;
            if (index === 0) {
                ctx.moveTo(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
            } else {
                ctx.lineTo(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
            }
        });
        ctx.stroke();
    });

    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell !== null) {
                ctx.fillStyle = "black";
                ctx.font = `${cellSize * 0.5}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(cell, c * cellSize + cellSize / 2, r * cellSize + cellSize / 2);
            }
        });
    });

    if (currentLine.length > 1) {
        drawCurrentLine(ctx, currentLine, colors[colorIndex], cellSize);
    }
}

function drawCurrentLine(ctx, currentLine, color, cellSize) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = cellSize * 0.4;
    ctx.lineCap = "round";
    currentLine.forEach((node, index) => {
        if (index === 0) {
            ctx.moveTo(node.col * cellSize + cellSize / 2, node.row * cellSize + cellSize / 2);
        } else {
            ctx.lineTo(node.col * cellSize + cellSize / 2, node.row * cellSize + cellSize / 2);
        }
    });
    ctx.stroke();
}

function getCellCoordinates(touch, cellSize, ctx) {
    const rect = ctx.canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    return { row, col };
}