import utils from "../Helper/HelperMethods";
const { shuffleArray, incrementNeighbors, moveMine, checkValidCell } = utils;

export default function generateMinesweeperGrid(
  rows,
  cols,
  mines,
  firstClick,
  algorithm = "advanced"
) {
  if (!firstClick)
    return Array.from({ length: rows }, () => Array(cols).fill(null));
  if (rows <= 0 || cols <= 0 || mines <= 0 || mines > rows * cols)
    throw new Error("Invalid input parameters");

  if (algorithm === "basic")
    return basicAlgorithm(rows, cols, mines, firstClick);

  return advancedAlgorithm(rows, cols, mines, firstClick);
}

function basicAlgorithm(rows, cols, mines, firstClick) {
  // Step 1: Initialize the grid with zeros
  let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Step 2: Place mines
  let mineCount = 0;
  while (mineCount < mines) {
    let randRow = Math.floor(Math.random() * rows);
    let randCol = Math.floor(Math.random() * cols);

    if (
      randRow !== firstClick[0] &&
      randCol !== firstClick[1] &&
      grid[randRow][randCol] === 0
    ) {
      // Ensure no duplicate mines
      grid[randRow][randCol] = "M";
      mineCount++;
    }
  }

  // Step 3: Calculate numbers
  // prettier-ignore
  const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], /*X*/  [0, 1],
  [1, -1], [1, 0], [1, 1]
];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === "M") continue;

      let mineCount = 0;
      for (let [dx, dy] of directions) {
        let newRow = row + dx;
        let newCol = col + dy;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols)
          if (grid[newRow][newCol] === "M") mineCount++;
      }
      grid[row][col] = mineCount;
    }
  }

  return grid;
}

function advancedAlgorithm(rows, cols, mines, firstClick) {
  // Check for valid input
  if (rows <= 0 || cols <= 0 || mines < 0 || mines > rows * cols) {
    throw new Error("Invalid input parameters");
  }

  // Step 1: Initialize the grid with zeros
  let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Step 2: Generate a list of all possible positions
  let positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push([r, c]);
    }
  }

  // Remove the firstClick position from possible mine positions
  positions = positions.filter((pos) =>
    checkValidCell(pos, firstClick, rows, cols)
  );

  // Step 3: Shuffle positions and place mines
  shuffleArray(positions);
  for (let i = 0; i < mines; i++) {
    let [row, col] = positions[i];
    grid[row][col] = "M";
    incrementNeighbors(grid, row, col, rows, cols);
  }

  // Step 4: Ensure the first click is not a mine (already done in position removal)
  if (grid[firstClick[0]][firstClick[1]] === "M") {
    moveMine(grid, firstClick[0], firstClick[1], rows, cols);
  }

  return grid;
}
