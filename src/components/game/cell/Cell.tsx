import type { FC, MouseEvent } from 'react'
import type { Position } from '../../../types/gameTypes'
import styles from './Cell.module.css'

type CellProps = {
  cell: number
  position: Position
  handleClick: {
    left: (position: Position) => void
    right: (e: MouseEvent<HTMLDivElement>, position: Position) => void
  }
}

export const Cell: FC<CellProps> = ({ cell, position, handleClick }) => (
  <div
    onClick={() => handleClick.left(position)}
    onContextMenu={(e) => handleClick.right(e, position)}
    onKeyDown={() => handleClick.left(position)}
    className={styles.cell}
  >
    {/* {cell} */}
  </div>
)
