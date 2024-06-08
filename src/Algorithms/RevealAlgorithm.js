export default function revealCell(
  grid,
  gridCondition,
  row,
  col,
  onGridConditionChange
) {
  const numRows = grid.length;
  const numCols = grid[0].length;

  // Check if the cell is valid and not already revealed
  if (
    row < 0 ||
    row >= numRows ||
    col < 0 ||
    col >= numCols ||
    gridCondition[row][col]
  )
    return 0;

  // Mark the cell as revealed
  let revealCells = 0;
  gridCondition[row][col] = true;
  ++revealCells;
  //   onGridConditionChange(row, col);

  // If the cell is empty, recursively reveal neighboring cells
  if (grid[row][col] === 0) {
    // Define the directions to neighboring cells
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

    // Recursively reveal neighboring cells
    revealCells = directions.reduce(
      (acc, [dr, dc]) =>
        acc +
        revealCell(
          grid,
          gridCondition,
          row + dr,
          col + dc,
          onGridConditionChange
        ),
      revealCells
    );
  }

  return revealCells;
}
