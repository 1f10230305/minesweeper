import type { MouseEvent } from 'react';
import { useState } from 'react';
import styles from './index.module.scss';

const Home = () => {
  const zeroArray: 0[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [userInputs, setUserInputs] = useState<(0 | 1 | 2 | 3)[][]>(zeroArray);
  const [bombMap, setBombMap] = useState<number[][]>(zeroArray);

  const board: number[][] = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

  const dirList: number[][] = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];

  let gameState: 0 | 1 | 2 = 0;

  const isFirst: boolean = userInputs.every((row) => row.every((cell) => cell !== 1));

  const checkAround = (x: number, y: number) => {
    let bombCount = 0;
    for (const dir of dirList) {
      if (bombMap[y + dir[1]] !== undefined && bombMap[y + dir[1]][x + dir[0]] === 1) {
        bombCount++;
      }
    }
    board[y][x] = bombCount;
    if (bombCount === 0) {
      for (const dir of dirList) {
        if (
          board[y + dir[1]] !== undefined &&
          (board[y + dir[1]][x + dir[0]] === -1 ||
            board[y + dir[1]][x + dir[0]] === 9 ||
            board[y + dir[1]][x + dir[0]] === 10)
        ) {
          checkAround(x + dir[0], y + dir[1]);
        }
      }
    }
  };

  const setBomb = (cannotPutX: number, cannotPutY: number) => {
    let bombCount = 0;
    const newBombMap: number[][] = JSON.parse(JSON.stringify(bombMap));
    while (bombCount < 10) {
      const n = Math.floor(Math.random() * 81);
      const x = n % 9;
      const y = Math.floor(n / 9);
      if (newBombMap[y][x] === 0 && !(x === cannotPutX && y === cannotPutY)) {
        newBombMap[y][x] = 1;
        bombCount++;
      }
    }
    setBombMap(newBombMap);
  };

  const burstBomb = (x: number, y: number) => {
    gameState = 2;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (bombMap[i][j] && userInputs[y][x] < 2) {
          board[i][j] = 11;
        }
      }
    }
    board[y][x] = 12;
  };

  const clickNumber = (x: number, y: number) => {
    let flagCount = 0;
    let bombCount = 0;
    for (const dir of dirList) {
      if (board[y + dir[1]] !== undefined && board[y + dir[1]][x + dir[0]]) {
        flagCount += userInputs[y + dir[1]][x + dir[0]] === 3 ? 1 : 0;
        bombCount += bombMap[y + dir[1]][x + dir[0]];
      }
    }
    if (flagCount === bombCount) {
      const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
      for (const dir of dirList) {
        if (board[y + dir[1]] !== undefined && board[y + dir[1]][x + dir[0]] < 9) {
          newUserInputs[y + dir[1]][x + dir[0]] = 1;
        }
      }
      setUserInputs(newUserInputs);
    }
  };

  const resetGame = () => {
    setUserInputs(zeroArray);
    setBombMap(zeroArray);
  };

  const clearGame = () => {};

  const setBoard = () => {
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        switch (userInputs[y][x]) {
          case 1:
            if (!isFirst && !bombMap[y][x]) checkAround(x, y);
            if (bombMap[y][x] === 1) burstBomb(x, y);
            break;
          case 2:
          case 3:
            if (board[y][x] === -1) board[y][x] = userInputs[y][x] + 7;
            break;
        }
      }
    }
  };
  setBoard();

  const clickLeft = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
    if (event.button === 0 && !gameState) {
      if (isFirst) setBomb(x, y);
      if (board[y][x] === -1) {
        const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
        newUserInputs[y][x] = 1;
        setUserInputs(newUserInputs);
      } else if (board[y][x] > 0 && board[y][x] < 9) {
        clickNumber(x, y);
        console.log('1');
      }
    }
  };

  const clickRight = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
    switch (board[y][x]) {
      case -1:
        newUserInputs[y][x] = 3;
        board[y][x] = 10;
        break;
      case 9:
        newUserInputs[y][x] = 0;
        board[y][x] = 0;
        break;
      case 10:
        newUserInputs[y][x] = 2;
        board[y][x];
        break;
    }
    setUserInputs(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.minesweeper}>
        <div className={styles.header}>
          <div />
          <button
            className={styles['reset-button']}
            onClick={resetGame}
            style={{ backgroundPosition: `${(gameState + 11) * -100}%` }}
          />
          <div />
        </div>
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                className={styles.cell}
                style={{ backgroundColor: board[y][x] === 12 ? '#f00' : '#0000' }}
                key={`${x}_${y}`}
                onContextMenu={(event) => clickRight(x, y, event)}
                onMouseUp={(event) => clickLeft(x, y, event)}
              >
                {(board[y][x] === -1 || (board[y][x] > 8 && board[y][x] < 11)) && (
                  <div className={styles.stone}>
                    {(board[y][x] === 9 || board[y][x] === 10) && (
                      <div
                        className={styles.icon}
                        style={{ backgroundPosition: `${(board[y][x] - 1) * -100}%` }}
                      />
                    )}
                  </div>
                )}
                {board[y][x] !== 0 && (
                  <div
                    className={styles.icon}
                    style={{
                      backgroundPosition:
                        board[y][x] === 12 ? '-1000%' : `${(board[y][x] - 1) * -100}%`,
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
