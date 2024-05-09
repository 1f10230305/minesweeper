import type { FC, MouseEvent } from 'react'
import type { Board as BoardType, Position } from '../../../types/gameTypes'
import { Cell } from '../cell/Cell'
import styles from './Board.module.css'

type BoardProps = {
  board: BoardType
  handleClick: {
    left: (position: Position) => void
    right: (e: MouseEvent<HTMLDivElement>, position: Position) => void
  }
}

export const Board: FC<BoardProps> = ({ board, handleClick }) => (
  <div className={styles.board}>
    {board.map((row, y) =>
      row.map((cell, x) => (
        <Cell key={`${x}-${y}-${cell}`} cell={cell} position={{ x, y }} handleClick={handleClick} />
      )),
    )}
  </div>
)
