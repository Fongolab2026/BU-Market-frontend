import ReactDom from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast'
import App from './Users/App.jsx'
import { PrimeReactProvider } from 'primereact/api'

ReactDom.createRoot(document.getElementById('root')).render(
  <>
    <Toaster />
    <PrimeReactProvider value={{ ripple: true }}>
      <App />
    </PrimeReactProvider>
  </>
)
