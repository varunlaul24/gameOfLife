function conwaysGame() {
  class GameOfLife {
  private
    constructor(gridSize, cellSize) {
      this.gridSize = gridSize;
      this.cellSize = cellSize;
      this.grid = [];
      this.gridHistory = []; // Array to store grid history
      this.gridContainer = document.getElementById("grid-container");
      this.timeoutId = null;
      this.EventListeners();
    }

    initializeGrid() {
      this.grid = [];
      for (let i = 0; i < this.gridSize; i++) {
        this.grid[i] = [];
        for (let j = 0; j < this.gridSize; j++) {
          this.grid[i][j] = Math.random() > 0.7 ? 1 : 0;
        }
      }
      this.saveToHistory(); // Save initial state to history
    }

    saveToHistory() {
      this.gridHistory.push(JSON.parse(JSON.stringify(this.grid))); // Cloning the current grid and store in history
    }

    initialRender() {
      this.renderUpdatedGrid();
    }

    renderUpdatedGrid() {
      this.gridContainer.innerHTML = ""; // Clear previous cells
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          const cell = document.createElement("div");
          cell.className = "cell";
          if (this.grid[i][j] === 1) {
            cell.classList.add("alive");
          }
          this.gridContainer.appendChild(cell);
        }
      }
    }

    countAliveNeighbors(i, j) {
      let count = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) continue; // Skips the current cell
          const neighborI = i + x;
          const neighborJ = j + y;
          if (neighborI >= 0 && neighborI < this.gridSize && neighborJ >= 0 && neighborJ < this.gridSize) {
            count += this.grid[neighborI][neighborJ];
          }
        }
      }
      return count;
    }

    nextGeneration() {
      this.saveToHistory(); // Save current state before computing next generation
      const newGrid = [];
      for (let i = 0; i < this.gridSize; i++) {
        newGrid[i] = [];
        for (let j = 0; j < this.gridSize; j++) {
          const neighbors = this.countAliveNeighbors(i, j);
          newGrid[i][j] = this.grid[i][j] === 1 ? (neighbors < 2 || neighbors > 3 ? 0 : 1) : (neighbors === 3 ? 1 : 0);
        }
      }
      this.grid = newGrid;
      this.renderUpdatedGrid();
    }

    undo() {
      if (this.gridHistory.length > 1) {
        this.gridHistory.pop(); // Remove current state
        this.grid = JSON.parse(JSON.stringify(this.gridHistory[this.gridHistory.length - 1])); // Restore previous state
        this.renderUpdatedGrid(); // Render the grid with the restored state
      }
    }

    pause() {
      clearInterval(this.timeoutId);
      this.timeoutId = null;
    }

    startGame() {
      if (this.timeoutId === null) {
        this.timeoutId = setInterval(() => this.nextGeneration(), 1000);
        let music = new Audio("./game-start-6104.mp3");
        music.play();
      }
    }

    reset() {
      this.pause();
      this.initializeGrid();
      this.renderUpdatedGrid();
    }

    EventListeners() {
      document.getElementById("start").addEventListener("click", () => this.startGame());
      document.getElementById("next-generation").addEventListener("click", () => this.nextGeneration());
      document.getElementById("reset").addEventListener("click", () => this.reset());
      document.getElementById("pause").addEventListener("click", () => this.pause());
      document.getElementById("undo").addEventListener("click", () => this.undo()); // Add undo button listener
    }
  }

  function init() {
    const game = new GameOfLife(20, 20);
    game.initializeGrid();
    game.initialRender();
  } 
  init();
}

conwaysGame();