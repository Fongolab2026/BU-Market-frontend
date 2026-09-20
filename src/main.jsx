import ReactDom from 'react-dom/client';
import './index.css';
import { Toaster } from 'react-hot-toast';
import App from './Users/App.jsx';

ReactDom.createRoot(document.getElementById('root')).render(
  <>
    <Toaster />
    <App />
  </>
)