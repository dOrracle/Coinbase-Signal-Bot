import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './Dashboard'

function App() {
  const [tradeInfo, setTradeInfo] = useState(null)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Dashboard tradeInfo={tradeInfo} setTradeInfo={setTradeInfo} />
      <div className="card">
        <button onClick={() => setTradeInfo({ /* mock trade confirmation data */ })}>
          Simulate Trade Confirmation
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
