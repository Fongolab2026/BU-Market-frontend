import ReactDom from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast'
import App from './Users/App.jsx'
import { PrimeReactProvider } from '@primereact/core/config'
import { BU_MARKET_PRESET } from './primereact-theme.js'

ReactDom.createRoot(document.getElementById('root')).render(
  <>
    <Toaster />
    <PrimeReactProvider theme={{ preset: BU_MARKET_PRESET }}>
      <App />
    </PrimeReactProvider>
  </>
)
