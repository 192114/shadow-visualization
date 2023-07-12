import { Spin } from 'antd'

import styles from './AppLoading.module.css'

export default function AppLoading() {
  return (
    <div className={styles.container}>
      <Spin size="large" />
    </div>
  )
}
