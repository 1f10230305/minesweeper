import type { MouseEvent } from 'react';
import { useState } from 'react';
import styles from './index.module.scss';

const Home = () => {
  const zeroArray: number[][] = [
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
  const [userInputs, setUserInputs] = useState(zeroArray);
  const [bombMap, setBombMap] = useState(zeroArray);

  const dirList: number[][] = [
    // 八方を-1,0,1で表現
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];

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

  let gameState = 0;

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
        if (board[y + dir[1]] !== undefined && board[y + dir[1]][x + dir[0]] === -1) {
          checkAround(x + dir[0], y + dir[1]);
        }
      }
    }
  };

  const burstBomb = (x: number, y: number) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (bombMap[j][i] && userInputs[y][x] < 2) {
          board[j][i] = 11;
        }
      }
    }
    board[y][x] = 12;
  };

  const isFirst = () => {
    let i = 0;
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (!bombMap[y][x] && board[y][x] >= 0 && board[y][x] < 9) {
          i++;
        }
      }
    }
    console.log(i);
    if (i === 81 - 10) {
      return true;
    } else {
      return false;
    }
  };

  let countRemainBlank = 71;
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      switch (userInputs[y][x]) {
        case 1:
          checkAround(x, y);
          break;
        case 2:
          board[y][x] = 9;
          break;
        case 3:
          board[y][x] = 10;
          break;
      }
      if (bombMap[y][x]) {
        if (userInputs[y][x] === 1) {
          gameState = 2;
          burstBomb(x, y);
        }
      } else {
        if (board[y][x] >= 0 && board[y][x] < 9) {
          countRemainBlank--;
          if (countRemainBlank === 0 && !isFirst()) {
            for (let i = 0; i < 9; i++) {
              for (let j = 0; j < 9; j++) {
                if (bombMap[i][j] && gameState === 2 && board[y][x] < 9) {
                  board[i][j] = 11;
                }
              }
            }
          }
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              if (bombMap[i][j] && gameState === 2 && board[y][x] < 9) {
                board[i][j] = 11;
              }
            }
          }
        }
      }
    }

    const setBomb = (x: number, y: number) => {
      let bombCount = 0;
      const newBombMap: number[][] = JSON.parse(JSON.stringify(bombMap));
      while (bombCount < 11) {
        const n = Math.floor(Math.random() * 81);
        const x2 = n % 9;
        const y2 = Math.floor(n / 9);
        if (bombMap[y2][x2] === 0 && x !== x2 && y !== y2) {
          newBombMap[y2][x2] = 1;
          bombCount++;
        }
      }
      setBombMap(newBombMap);
    };

    const reset = () => {
      setUserInputs(zeroArray);
      setBombMap(zeroArray);
    };

    const clickStoneLeft = (x: number, y: number) => {
      if (!gameState) {
        const i = bombMap.some((row: number[]) => row.includes(1));
        if (!i) {
          console.log('aaa');
          setBomb(x, y);
        }
        if (board[y][x] === -1) {
          const newUserInputs: number[][] = JSON.parse(JSON.stringify(userInputs));
          newUserInputs[y][x] = 1;
          setUserInputs(newUserInputs);
        }
        if (bombMap[y][x]) {
          gameState = 2;
          burstBomb(x, y);
        } else {
          checkAround(x, y);
        }
      }
    };

    const clickStoneRight = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      const newUserInputs: number[][] = JSON.parse(JSON.stringify(userInputs));
      switch (board[y][x]) {
        case -1:
          newUserInputs[y][x] = 3;
          board[y][x] = 10;
          break;
        case 9:
          newUserInputs[y][x] = -1;
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
          <div className={styles.top}>
            <div />
            <button
              className={styles['reset-button']}
              onClick={reset}
              style={{ backgroundPosition: `${(gameState + 11) * -100}%` }}
            />
            <div />
          </div>
          <div className={styles.board}>
            {board.map((row, y) =>
              row.map((cell, x) => (
                <div
                  style={{
                    backgroundColor: board[y][x] === 12 ? '#f00' : '#0000',
                  }}
                  className={styles.cell}
                  key={`${x}_${y}`}
                >
                  {(board[y][x] === -1 || (board[y][x] > 8 && board[y][x] < 11)) && (
                    <div
                      className={styles.stone}
                      onMouseUp={() => clickStoneLeft(x, y)}
                      onContextMenu={(event) => clickStoneRight(x, y, event)}
                    >
                      {(board[y][x] === 9 || board[y][x] === 10) && (
                        <div
                          className={styles.icon}
                          style={{
                            backgroundPosition: `${(board[y][x] - 1) * -100}%`,
                          }}
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
  }
};

export default Home;
