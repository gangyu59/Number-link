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

    drawGrid();
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";

    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
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
      drawCurrentLine();
    }
  }

  function handleTouchStart(event) {
    const touch = event.touches ? event.touches[0] : event;
    if (!touch) return;
    const { row, col } = getCellCoordinates(touch);
    if (grid[row][col] !== undefined) {
      startNode = { row, col, value: grid[row][col] };
      currentLine = [{ row, col }];
      colorIndex = (colorIndex + 1) % colors.length;
    }
  }

  function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches ? event.touches[0] : event;
    if (!touch || !startNode) return;
    const { row, col } = getCellCoordinates(touch);
    const lastNode = currentLine[currentLine.length - 1];

    if (isValidMove(lastNode, { row, col })) {
      currentLine.push({ row, col });
      drawGrid();
    }
  }

  function handleTouchEnd(event) {
    if (!startNode) return;
    const touch = event.changedTouches ? event.changedTouches[0] : event;
    const { row, col } = getCellCoordinates(touch);
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      const endNode = { row, col, value: grid[row][col] };
      lines.push({ color: colors[colorIndex], path: currentLine });
      moveCount += currentLine.length;
      moveCounter.textContent = `步数 = ${moveCount}`;
      checkWinCondition();
    }

    startNode = null;
    currentLine = [];
    drawGrid();
  }

  function getCellCoordinates(touch) {
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    return { row, col };
  }

  function isValidMove(from, to) {
    if (to.row < 0 || to.row >= gridSize || to.col < 0 || to.col >= gridSize) return false;
    if (Math.abs(from.row - to.row) + Math.abs(from.col - to.col) !== 1) return false;
    return true;
  }

  function drawCurrentLine() {
    ctx.beginPath();
    ctx.strokeStyle = colors[colorIndex];
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

  function checkWinCondition() {
    const totalPairs = difficulties[difficultySlider.value].pairs.length;
    const completedPairs = lines.length;

    // 检查所有数字对是否连接
    const allPairsConnected = completedPairs === totalPairs;

    // 检查所有空格是否被画线经过
    const allCellsCovered = grid.every((row, rowIndex) =>
      row.every((cell, colIndex) =>
        cell !== null || lines.some(line =>
          line.path.some(node =>
            node.row === rowIndex && node.col === colIndex
          )
        )
      )
    );

    // 检查是否有交叉画线
    const noCrossingLines = !lines.some((line1, index1) =>
      lines.some((line2, index2) => {
        if (index1 === index2) return false;
        return line1.path.some(point1 =>
          line2.path.some(point2 =>
            point1.row === point2.row && point1.col === point2.col && index1 !== index2
          )
        );
      })
    );

    if (allPairsConnected && allCellsCovered && noCrossingLines) {
      message.textContent = "恭喜成功！";
      message.style.color = "green";
    } else {
      message.textContent = "失败了，再来一次，加油！";
      message.style.color = "red";
    }
  }

  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);
  canvas.addEventListener("touchend", handleTouchEnd);

  initializeGame(1); // Initialize with default difficulty
});