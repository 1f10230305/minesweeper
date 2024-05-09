import styles from './Header.module.css'

export const Header = () => (
  <header className={styles.header}>
    <div className={styles.numbers} />
    <button type="button" className={styles.button} />
    <div className={styles.numbers} />
  </header>
)
