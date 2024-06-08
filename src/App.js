import { useState, useEffect, useRef } from "react";
import generateMinesweeperGrid from "./Algorithms/GenerateAlgorithm";
import revealCell from "./Algorithms/RevealAlgorithm";

export default function App() {
  const [isGameRun, setIsGameRun] = useState(false);
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(5);
  const [difficulty, setDifficulty] = useState(10);
  const [mines, setMines] = useState(null);
  const [grid, setGrid] = useState(
    Array.from({ length: height }, () => Array(width).fill(0))
  );
  const [gridCondition, setGridCondition] = useState(
    Array.from({ length: height }, () => Array(width).fill(false))
  );
  const [click, setClick] = useState(null);
  const [firstClick, setFirstClick] = useState(null);
  const [count, setCount] = useState(0);
  const [totalTimeRun, setTotalTimeRun] = useState(0);
  const [isGridCreated, setIsGridCreated] = useState(false);
  const [time, setTime] = useState(0);
  const [timeCounter, setTimeCounter] = useState(null);
  const [timePlayed, setTimePlayed] = useState(0);
  const [remainedCell, setRemainedCell] = useState(height * width - mines);
  const [isGameWinner, setIsGameWinner] = useState(false);
  const [isRestartNeeded, setIsRestartNeeded] = useState(false);
  const [globalMarked, setGlobalMarked] = useState("");

  useEffect(() => {
    document.documentElement.style.setProperty("--grid-width", width);
    if (isGameRun) {
      let newGrid = grid;
      if (count === 1 && !isGridCreated) {
        newGrid = generateMinesweeperGrid(height, width, mines, firstClick);
        setGrid(newGrid);
        setIsGridCreated(true);
      }
      if (isRestartNeeded) {
        handleGameEnd();
        setIsRestartNeeded(false);
        handleReplay();
      }
    }
    if (globalMarked === "1") setGlobalMarked("");
  }, [
    grid,
    gridCondition,
    width,
    firstClick,
    height,
    mines,
    count,
    click,
    isGridCreated,
    isGameRun,
    remainedCell,
    handleGameEnd,
  ]);

  function handleGridConditionChange(row, col) {
    setGridCondition((gridCondition) =>
      gridCondition.map((r, rowIdx) =>
        r.map((cell, colIdx) =>
          row === rowIdx && col === colIdx ? true : cell
        )
      )
    );
  }

  function handleCellClick([row, col]) {
    if (!firstClick) {
      setFirstClick(() => [row, col]);
      setIsGameRun(true);
      setTimeCounter(setInterval(() => setTime((time) => time + 1), 1000));
    }

    setClick(() => [row, col]);
    // handleGridConditionChange(row, col);
    setCount((count) => count + 1);
  }

  function handleGameWin() {
    setIsGameWinner(true);
    handleGameEnd();
  }

  function handleGameEnd() {
    setGlobalMarked("1");
    setIsGameRun(false);
    timeCounter && clearInterval(timeCounter);
    setGridCondition(
      Array.from({ length: height }, () => Array(width).fill(true))
    );
  }

  function handleReplay() {
    const originalWidth = width;
    setWidth(0);
    setIsGameRun(true);
    setMines(Math.floor((height * width) / (15 - difficulty)));
    setGrid(Array.from({ length: height }, () => Array(width).fill(0)));
    setGridCondition(
      Array.from({ length: height }, () => Array(width).fill(false))
    );
    setClick(null);
    setFirstClick(null);
    setCount(0);
    setTotalTimeRun(0);
    setIsGridCreated(false);
    setTime(0);
    setTimeCounter(null);
    setTimePlayed((timePlayed) => timePlayed + 1);
    setIsGameWinner(false);
    setRemainedCell(height * width - mines);
    setWidth(originalWidth);
  }

  if (
    isGameRun &&
    isGridCreated &&
    click &&
    count >= 1 &&
    totalTimeRun < count
  ) {
    setTotalTimeRun((totalTimeRun) => totalTimeRun + 1);
    revealCell(
      grid,
      gridCondition,
      click[0],
      click[1],
      handleGridConditionChange
    );
    const cellLeft = gridCondition.flat().filter((cell) => !cell).length;
    setRemainedCell(cellLeft);
    if (cellLeft === Math.floor((height * width) / (15 - difficulty)))
      handleGameWin();
  }

  return (
    <div className="App">
      {!isGameRun && (
        <Overlay
          onReplay={() => {
            handleGameEnd();
            handleReplay();
          }}
          timePlayed={timePlayed}
          isGameWinner={isGameWinner}
        />
      )}
      <div className="grid-container">
        <Grid
          grid={grid}
          height={height}
          width={width}
          difficulty={difficulty}
          click={click}
          onClick={handleCellClick}
          gridCondition={gridCondition}
          mines={mines}
          setMines={setMines}
          onGameEnd={handleGameEnd}
          onGameWin={handleGameWin}
          isGameRun={isGameRun}
          remainedCell={remainedCell}
          isRestartNeeded={isRestartNeeded}
          globalMarked={globalMarked}
        />
      </div>
      <SidePanel
        time={time}
        mines={mines}
        height={height}
        width={width}
        difficulty={difficulty}
        setHeight={setHeight}
        setWidth={setWidth}
        setDifficulty={setDifficulty}
        onSet={setIsRestartNeeded}
      ></SidePanel>
    </div>
  );
}

function Grid({
  grid,
  click,
  onClick,
  gridCondition,
  mines,
  setMines,
  onGameEnd,
  isGameRun,
  onGameWin,
  onRevealAll,
  height,
  width,
  difficulty,
  remainedCell,
  isRestartNeeded,
  globalMarked,
}) {
  return (
    <div className="grid-table">
      {grid?.map((row, rowNum) => (
        <Row
          row={row}
          rowNum={rowNum}
          key={rowNum}
          click={click}
          onClick={onClick}
          rowCondition={gridCondition[rowNum]}
          mines={mines}
          setMines={setMines}
          isGameRun={isGameRun}
          onGameEnd={onGameEnd}
          onGameWin={onGameWin}
          onRevealAll={onRevealAll}
          height={height}
          width={width}
          difficulty={difficulty}
          remainedCell={remainedCell}
          isRestartNeeded={isRestartNeeded}
          globalMarked={globalMarked}
        />
      ))}
    </div>
  );
}

function Row({
  row,
  rowNum,
  onClick,
  rowCondition,
  mines,
  setMines,
  onGameEnd,
  isGameRun,
  onGameWin,
  click,
  height,
  width,
  difficulty,
  remainedCell,
  isRestartNeeded,
  globalMarked,
}) {
  return row.map((cell, colNum) => (
    <Cell
      rowNum={rowNum}
      colNum={colNum}
      click={click}
      onClick={onClick}
      cell={cell}
      cellCondition={rowCondition[colNum]}
      key={`${rowNum}-${colNum}${globalMarked}`}
      mines={mines}
      setMines={setMines}
      isGameRun={isGameRun}
      onGameEnd={onGameEnd}
      onGameWin={onGameWin}
      height={height}
      width={width}
      difficulty={difficulty}
      remainedCell={remainedCell}
      isRestartNeeded={isRestartNeeded}
      globalMarked={globalMarked}
    >
      {rowCondition[colNum]
        ? cell === "M"
          ? click[0] === rowNum && click[1] === colNum
            ? "💥"
            : "💣"
          : !cell
          ? ""
          : cell
        : ""}
    </Cell>
  ));
}

function Cell({
  children,
  rowNum,
  colNum,
  cell,
  cellCondition,
  click,
  onClick,
  mines,
  setMines,
  isGameRun,
  onGameEnd,
  onGameWin,
  height,
  width,
  difficulty,
  remainedCell,
  isRestartNeeded,
  globalMarked,
}) {
  const [marked, setMarked] = useState(false);
  const clickButton = useRef(null);
  useEffect(() => {
    if (!globalMarked) {
      setMarked(false);
    }
  }, [globalMarked]);
  function onCellClick(e) {
    // console.log(`${rowNum}-${colNum}`, cellCondition, marked, e.button);
    if (cellCondition) return;
    const isEmpty = e.target.textContent === "";
    if (e.button === 2 && isGameRun) {
      setMarked((marked) => !marked);
      if (isEmpty) setMines((mines) => mines - 1);
      else
        setMines((mines) =>
          mines >= Math.floor((height * width) / (15 - difficulty))
            ? Math.floor((height * width) / (15 - difficulty))
            : mines + 1
        );
      e.target.textContent = isEmpty ? "🚩" : children;

      // Game over check
      return;
    }
    if (e.button === 0) {
      if (!marked) {
        if (cell === "M") {
          e.target.textContent = "💥";
          onGameEnd();
        } else onClick([rowNum, colNum]);
        //  else if (
        //   isEmpty &&
        //   remainedCell - 1 === Math.floor((height * width) / (15 - difficulty))
        // ) {
        //   onGameWin();
        // }
      }
    }
  }

  function onContextMenuOpen(e) {
    e.preventDefault();
  }

  return (
    <div
      className={!cellCondition ? "cyan" : cell === "M" ? "orangered" : ""}
      ref={clickButton}
      onContextMenu={onContextMenuOpen}
      onMouseDown={onCellClick}
    >
      {children}
    </div>
  );
}

function SidePanel({
  time,
  mines,
  height,
  setHeight,
  width,
  setWidth,
  difficulty,
  setDifficulty,
  onSet,
}) {
  return (
    <div className="side-panel">
      <Clock>{time}</Clock>
      <RemainerMines>{mines}</RemainerMines>
      <Input value={height} setValue={setHeight} onSet={onSet}>
        Row
      </Input>
      <Input value={width} setValue={setWidth} onSet={onSet}>
        Column
      </Input>
      <Input value={difficulty} setValue={setDifficulty} onSet={onSet}>
        Difficulty
      </Input>
    </div>
  );
}

function Clock({ children }) {
  return (
    <div className="clock">
      <h3>Play Time</h3>
      <div>{children}</div>
    </div>
  );
}

function RemainerMines({ children }) {
  return (
    <div className="mines">
      <h3>Mines Left</h3>
      <div>{children}</div>
    </div>
  );
}

function Overlay({ onReplay, timePlayed, isGameWinner }) {
  const isFirstTimePlayed = timePlayed === 0;
  return (
    <div className="overlay">
      <div className="overlay-panel">
        <h1>MINESWEEPERS</h1>
        {!isFirstTimePlayed ? (
          <h3>{isGameWinner ? "YOU WIN! 🎉🎉🎉" : "GAMEOVER"}</h3>
        ) : (
          ""
        )}
        <Button onReplay={onReplay}>
          {!isFirstTimePlayed > 0 ? "Replay" : "Play"}
        </Button>
      </div>
    </div>
  );
}

function Button({ children, onReplay }) {
  return (
    <button className="btn" onClick={onReplay}>
      {children}
    </button>
  );
}

function Input({ value, setValue, onSet, children }) {
  return (
    <div className="input-control">
      <label>{children}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(+e.target.value);
          onSet(true);
        }}
      />
    </div>
  );
}
