import type { FC } from 'react'
import { useGame } from '../../hooks/useGame'
import styles from './Game.module.css'
import { Board } from './board/Board'
import { Header } from './header/Header'

export const Game: FC = () => {
  const { board, handleClick } = useGame()

  return (
    <div className={styles.game}>
      <Header />
      <Board board={board} handleClick={handleClick} />
    </div>
  )
}
