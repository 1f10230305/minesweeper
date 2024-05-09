import type { FC } from 'react'
import { Game } from '../components/game/Game'
import styles from './index.module.css'

const Home: FC = () => {
  return (
    <div className={styles.container}>
      <Game />
    </div>
  )
}

export default Home
