function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function incrementNeighbors(grid, row, col, rows, cols) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let [dx, dy] of directions) {
    let newRow = row + dx;
    let newCol = col + dy;

    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      if (grid[newRow][newCol] !== "M") {
        grid[newRow][newCol]++;
      }
    }
  }
}

function moveMine(grid, row, col, rows, cols) {
  grid[row][col] = 0; // Remove the mine
  let moved = false;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0 && !(r === row && c === col)) {
        grid[r][c] = "M";
        incrementNeighbors(grid, r, c, rows, cols);

        moved = true;
        break;
      }
    }
    if (moved) break;
  }

  // Re-adjust neighbors for the original mine position
  decrementNeighbors(grid, row, col, rows, cols);
}

function decrementNeighbors(grid, row, col, rows, cols) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let [dx, dy] of directions) {
    let newRow = row + dx;
    let newCol = col + dy;

    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      if (grid[newRow][newCol] !== "M") {
        grid[newRow][newCol]--;
      }
    }
  }
}

function checkValidCell(pos, firstClick, rows, cols) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const isNeighborValid = !directions
    .map(([dr, dc]) => [dr + pos[0], dc + pos[1]])
    .some((cell) => !isValidCell(cell, firstClick));

  return isValidCell(pos, firstClick) && isNeighborValid;
}

function isValidCell(pos, firstClick) {
  return !(pos[0] === firstClick[0] && pos[1] === firstClick[1]);
}

const utils = {
  shuffleArray,
  incrementNeighbors,
  moveMine,
  checkValidCell,
};
export default utils;
