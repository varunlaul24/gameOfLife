function conwaysGame() {
  class GameOfLife {
    private gridSize: number;
    private cellSize: number;
    private grid: number[][];
    private gridHistory: number[][][];
    private gridContainer: HTMLElement | null;
    private timeoutId: number | null;

    constructor(gridSize: number, cellSize: number) {
      this.gridSize = gridSize;
      this.cellSize = cellSize;
      this.grid = [];
      this.gridHistory = []; // Array to store grid history
      this.gridContainer = document.getElementById("grid-container");
      this.timeoutId = null;
      this.attachEventListener();
    }

    public initializeGrid(): void {
      this.grid = [];
      for (let row = 0; row < this.gridSize; row++) {
        this.grid[row] = [];
        for (let col = 0; col < this.gridSize; col++) {
          this.grid[row][col] = Math.random() > 0.7 ? 1 : 0;
        }
      }
      this.saveToHistory(); // Save initial state to history
    }

    private saveToHistory(): void {
      this.gridHistory.push(JSON.parse(JSON.stringify(this.grid))); // Cloning the current grid and store in history
    }

    public initialRender(): void {
      this.renderUpdatedGrid();
    }

    private renderUpdatedGrid(): void {
      if (!this.gridContainer) return;
      this.gridContainer.innerHTML = ""; // Clear previous cells
      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          const cell = document.createElement("div");
          cell.className = "cell";
          if (this.grid[row][col] === 1) {
            cell.classList.add("alive");
          }
          this.gridContainer.appendChild(cell);
        }
      }
    }

    private countAliveNeighbors(i: number, j: number): number {
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

    private nextGeneration(): void {
      this.saveToHistory(); // Save current state before computing next generation
      const newGrid: number[][] = [];
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

    private undo(): void {
      if (this.gridHistory.length > 1) {
        this.gridHistory.pop(); // Remove current state
        this.grid = JSON.parse(JSON.stringify(this.gridHistory[this.gridHistory.length - 1])); // Restore previous state
        this.renderUpdatedGrid(); // Render the grid with the restored state
      }
    }

    private pause(): void {
      if (this.timeoutId !== null) {
        clearInterval(this.timeoutId);
        this.timeoutId = null;
      }
    }

    private startGame(): void {
      if (this.timeoutId === null) {
        this.timeoutId = setInterval(() => this.nextGeneration(), 1000);
        const music = new Audio("./game-start-6104.mp3");
        music.play();
      }
    }

    private reset(): void {
      this.pause();
      this.initializeGrid();
      this.renderUpdatedGrid();
    }

    private attachEventListener(): void {
      document.getElementById("start")?.addEventListener("click", () => this.startGame());
      document.getElementById("next-generation")?.addEventListener("click", () => this.nextGeneration());
      document.getElementById("reset")?.addEventListener("click", () => this.reset());
      document.getElementById("pause")?.addEventListener("click", () => this.pause());
      document.getElementById("undo")?.addEventListener("click", () => this.undo()); // Add undo button listener
    }
  }

  function init(): void {
    const game = new GameOfLife(20, 20);
    game.initializeGrid();
    game.initialRender();
  }

  init();
}

conwaysGame();