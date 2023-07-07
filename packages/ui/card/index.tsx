'use client'
import styles from './index.module.css'

export function CardWrapper () {
  return <div className={styles.container}>
    <p className={styles.title}>title</p>
    <div className={styles.content}>
      content
    </div>
  </div>
}