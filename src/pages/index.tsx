import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

const Home = () => {
  // 指定された幅高さの二次元配列を作成
  const createBoard = (width: number, height: number, value: number) => {
    const newBoard: number[][] = [];
    for (let i = 0; i < height; i++) {
      const row: number[] = [];
      for (let j = 0; j < width; j++) {
        row.push(value);
      }
      newBoard.push(row);
    }
    return newBoard;
  };

  // 状態
  const [userInputs, setUserInputs] = useState<number[][]>(createBoard(9, 9, 0));
  const [bombMap, setBombMap] = useState<number[][]>(createBoard(9, 9, 0));
  const [time, setTime] = useState({
    startTime: 0,
    currentTime: 0,
  });

  let gameState: 0 | 1 | 2 | 3 = 0;
  const boardWidth: number = userInputs[0].length;
  const boardHeight: number = userInputs.length;

  const board: number[][] = createBoard(boardWidth, boardHeight, -1);

  // 八方を-1,0,1の配列で
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

  const isFirst: boolean = userInputs.every((row) => row.every((cell) => cell !== 1));

  // 空白連鎖
  const checkAround = (x: number, y: number) => {
    let bombs = 0;
    for (const dir of dirList) {
      if (bombMap[y + dir[1]] !== undefined && bombMap[y + dir[1]][x + dir[0]] === 1) {
        bombs++;
      }
    }
    board[y][x] = bombs;
    if (bombs === 0) {
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

  // 爆弾を配置
  const setBomb = (cannotPutX: number, cannotPutY: number) => {
    let bombs = 0;
    const newBombMap: number[][] = JSON.parse(JSON.stringify(bombMap));
    while (bombs < 10) {
      const n = Math.floor(Math.random() * boardWidth * boardHeight);
      const x = n % boardWidth;
      const y = Math.floor(n / boardWidth);
      if (newBombMap[y][x] === 0 && !(x === cannotPutX && y === cannotPutY)) {
        newBombMap[y][x] = 1;
        bombs++;
      }
    }
    setBombMap(newBombMap);
  };

  // 爆弾をクリック時
  const burstBomb = (x: number, y: number) => {
    gameState = 3;
    for (let i = 0; i < boardWidth; i++) {
      for (let j = 0; j < boardHeight; j++) {
        if (bombMap[j][i] && userInputs[j][i] < 2) {
          board[j][i] = 11;
        }
      }
    }
    board[y][x] = 12;
  };

  // 数字クリック
  const clickNumber = (x: number, y: number) => {
    let flagCount = 0;
    let bombs = 0;
    for (const dir of dirList) {
      if (board[y + dir[1]] !== undefined && board[y + dir[1]][x + dir[0]]) {
        flagCount += userInputs[y + dir[1]][x + dir[0]] === 3 ? 1 : 0;
        bombs += bombMap[y + dir[1]][x + dir[0]];
      }
    }
    if (flagCount === bombs) {
      const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
      for (const dir of dirList) {
        if (board[y + dir[1]] !== undefined && board[y + dir[1]][x + dir[0]] < 9) {
          newUserInputs[y + dir[1]][x + dir[0]] = 1;
        }
      }
      setUserInputs(newUserInputs);
    }
  };

  // ゲームリセット
  const resetGame = () => {
    setUserInputs(createBoard(boardWidth, boardHeight, 0));
    setBombMap(createBoard(boardWidth, boardHeight, 0));
    setTime({
      startTime: 0,
      currentTime: 0,
    });
    gameState = 0;
  };

  // ゲームエンド
  const finishGame = () => {
    let stoneCount = 0;
    for (let x = 0; x < boardWidth; x++) {
      for (let y = 0; y < boardHeight; y++) {
        if (board[y][x] === -1 || board[y][x] === 9 || board[y][x] === 10) stoneCount++;
      }
    }
    if (stoneCount === 10) {
      gameState = 2;
      for (let x = 0; x < boardWidth; x++) {
        for (let y = 0; y < boardHeight; y++) {
          if (bombMap[y][x] === 1) board[y][x] = 10;
        }
      }
    }
  };

  // 横に並ぶマスの数を変える
  const changeWidth = (width: number) => {
    if (width !== undefined && width > 0 && width < 100) {
      const height: number = userInputs.length;
      resetGame();
      setUserInputs(createBoard(width, height, 0));
      setBombMap(createBoard(width, height, 0));
    }
  };

  // 縦に並ぶマスの数を変える
  const changeHeight = (height: number) => {
    if (height !== undefined && height > 0 && height < 100) {
      const width: number = userInputs[0].length;
      resetGame();
      setUserInputs(createBoard(width, height, 0));
      setBombMap(createBoard(width, height, 0));
    }
  };

  // タイマーを更新するuseEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (gameState === 1 && (time.currentTime - time.startTime) / 1000 < 999) {
        setTime({
          ...time,
          currentTime: Date.now(),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  // 置ける旗の数
  const countCanPutFlag = (digit: 1 | 2 | 3) => {
    let count = 10;
    for (let x = 0; x < boardWidth; x++) {
      for (let y = 0; y < boardHeight; y++) {
        if (userInputs[y][x] === 3) {
          count--;
        }
      }
    }
    switch (digit) {
      case 1:
        return Math.floor(Math.abs(count) % 10);
      case 2:
        return Math.floor((Math.abs(count) % 100) / 10);
      case 3:
        if (count < 0) {
          return 'minus';
        } else {
          return Math.floor(count / 100);
        }
    }
  };

  // ボードの計算値
  const setBoard = () => {
    if (!isFirst) gameState = 1;
    for (let x = 0; x < boardWidth; x++) {
      for (let y = 0; y < boardHeight; y++) {
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
    finishGame();
  };
  // 計算されたボードを表示
  setBoard();

  // 左クリックの処理
  const clickLeft = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
    if (event.button === 0 && gameState <= 1) {
      if (isFirst) {
        gameState = 1;
        setBomb(x, y);
        setTime({
          startTime: Date.now(),
          currentTime: Date.now(),
        });
      }
      if (board[y][x] === -1) {
        const newUserInputs: (0 | 1 | 2 | 3)[][] = JSON.parse(JSON.stringify(userInputs));
        newUserInputs[y][x] = 1;
        setUserInputs(newUserInputs);
      } else if (board[y][x] > 0 && board[y][x] < 9) {
        clickNumber(x, y);
      }
    }
  };

  //右クリックの処理
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
        <header className={styles.header}>
          <div className={styles.counter}>
            <div className={`${styles.num} ${styles[`num-${countCanPutFlag(3)}`]}`}>
              <div className={styles['num-top']} />
              <div className={styles['num-bottom']} />
            </div>
            <div className={`${styles.num} ${styles[`num-${countCanPutFlag(2)}`]}`}>
              <div className={styles['num-top']} />
              <div className={styles['num-bottom']} />
            </div>
            <div className={`${styles.num} ${styles[`num-${countCanPutFlag(1)}`]}`}>
              <div className={styles['num-top']} />
              <div className={styles['num-bottom']} />
            </div>
          </div>
          <button
            className={styles['reset-button']}
            onClick={resetGame}
            style={{ backgroundPosition: !gameState ? '-1100%' : `${(gameState + 10) * -100}%` }}
          />
          <div className={styles.counter}>
            <div
              className={`${styles.num} ${
                styles[`num-${Math.floor((time.currentTime - time.startTime) / 100000)}`]
              }`}
            >
              <div className={styles['num-top']} />
              <div className={styles['num-bottom']} />
            </div>
            <div
              className={`${styles.num} ${
                styles[`num-${Math.floor(((time.currentTime - time.startTime) % 100000) / 10000)}`]
              }`}
            >
              <div className={styles['num-top']} />
              <div className={styles['num-bottom']} />
            </div>
            <div
              className={`${styles.num} ${
                styles[`num-${Math.floor(((time.currentTime - time.startTime) % 10000) / 1000)}`]
              }`}
            >
              <div className={styles['num-top']} />
              <div className={styles['num-bottom']} />
            </div>
          </div>
        </header>
        <div
          className={styles.board}
          style={{ gridTemplate: `repeat(${boardHeight}, 1fr) / repeat(${boardWidth}, 1fr)` }}
        >
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                className={`${styles.cell} ${bombMap[y][x] ? styles['has-bomb'] : ''}`}
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
        <footer className={styles.footer}>
          <input
            type="number"
            name="width"
            value={boardWidth}
            min="1"
            max="50"
            onInput={(e) => changeWidth(parseInt(e.currentTarget.value))}
          />
          <input
            type="number"
            name="height"
            value={boardHeight}
            min="1"
            max="50"
            onInput={(e) => changeHeight(parseInt(e.currentTarget.value))}
          />
        </footer>
      </div>
    </div>
  );
};

export default Home;
