import React from 'react'
import ReactDOM from 'react-dom/client'
import Decimal from 'decimal.js-light'

import App from '~/App'

import 'antd/dist/reset.css'
import '~/styles/variable.css'
import '~/styles/index.css'

// 四舍五入
Decimal.set({ rounding: Decimal.ROUND_HALF_EVEN })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
