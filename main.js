import './style.css'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello!</h1>
      <currency-table currency="eur"></currency-table>
    </div>
  </div>
`

