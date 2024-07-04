document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById("start-button");
    const difficultySlider = document.getElementById("difficulty-slider");
    const difficultyLabel = document.getElementById("difficulty-label");
    const moveCounter = document.getElementById("move-counter");
    const message = document.getElementById("message");
    let gridSize, grid, lines, currentLine, startNode, moveCount, cellSize;
    const colors = ["red", "blue", "green", "purple", "orange"];
    let colorIndex = 0;

    const difficulties = {
        1: { label: "超易", size: 4, pairs: [[1, [0, 0], [3, 3]], [2, [0, 3], [3, 0]]] },
        2: { label: "较易", size: 5, pairs: [[1, [0, 0], [4, 4]], [2, [0, 4], [4, 0]], [3, [2, 2], [3, 3]]] },
        3: { label: "中等", size: 6, pairs: [[1, [0, 0], [5, 5]], [2, [0, 5], [5, 0]], [3, [2, 2], [3, 3]], [4, [1, 4], [4, 1]]] },
        4: { label: "较难", size: 7, pairs: [[1, [0, 0], [6, 6]], [2, [0, 6], [6, 0]], [3, [2, 2], [4, 4]], [4, [1, 5], [5, 1]], [5, [3, 3], [3, 6]]] },
        5: { label: "超难", size: 8, pairs: [[1, [0, 0], [7, 7]], [2, [0, 7], [7, 0]], [3, [2, 2], [5, 5]], [4, [1, 6], [6, 1]], [5, [3, 4], [4, 3]], [6, [0, 4], [4, 0]]] }
    };

    difficultySlider.addEventListener("input", () => {
        const difficulty = difficultySlider.value;
        difficultyLabel.textContent = difficulties[difficulty].label;
    });

    startButton.addEventListener("click", () => {
        initializeGame(difficultySlider.value);
    });

    function initializeGame(difficulty) {
        const config = difficulties[difficulty];
        gridSize = config.size;
        grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
        lines = [];
        currentLine = [];
        startNode = null;
        moveCount = 0;
        message.textContent = "";
        moveCounter.textContent = "步数 = 0";

        // Populate grid with pairs
        config.pairs.forEach(([n, start, end]) => {
            grid[start[0]][start[1]] = n;
            grid[end[0]][end[1]] = n;
        });

        // Adjust canvas size and cell size
        canvas.width = canvas.height = Math.min(window.innerWidth, window.innerHeight) * 0.8;
        cellSize = canvas.width / gridSize;

        drawGrid(ctx, gridSize, cellSize, lines, grid, currentLine, colors, colorIndex);
    }

    function handleTouchStart(event) {
        const touch = event.touches ? event.touches[0] : event;
        if (!touch) return;
        const { row, col } = getCellCoordinates(touch, cellSize, ctx);
        if (grid[row][col] !== null) {
            startNode = { row, col, value: grid[row][col] };
            currentLine = [{ row, col }];
            colorIndex = (colorIndex + 1) % colors.length;
        }
    }

    function handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches ? event.touches[0] : event;
        if (!touch || !startNode) return;
        const { row, col } = getCellCoordinates(touch, cellSize, ctx);
        const lastNode = currentLine[currentLine.length - 1];

        currentLine.push({ row, col });
        drawGrid(ctx, gridSize, cellSize, lines, grid, currentLine, colors, colorIndex);
    }

    function handleTouchEnd(event) {
        if (!startNode) return;
        const touch = event.changedTouches ? event.changedTouches[0] : event;
        const { row, col } = getCellCoordinates(touch, cellSize, ctx);
        const endNode = { row, col, value: grid[row][col] };

        lines.push({ color: colors[colorIndex], path: currentLine });
        moveCount += currentLine.length;
        moveCounter.textContent = `步数 = ${moveCount}`;
        if (checkWinCondition(grid, lines, difficulties[difficultySlider.value].pairs.length)) {
            message.textContent = "恭喜成功！";
            message.style.color = "green";
        } else {
            message.textContent = "失败了，再来一次，加油！";
            message.style.color = "red";
        }

        startNode = null;
        currentLine = [];
        drawGrid(ctx, gridSize, cellSize, lines, grid, currentLine, colors, colorIndex);
    }

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    initializeGame(1); // Initialize with default difficulty
});