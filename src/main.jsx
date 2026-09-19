import ReactDom from 'react-dom/client';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { router } from './Users/routes/AppRouter.jsx';

ReactDom.createRoot(document.getElementById("root")).render(
  <>
  <Toaster/>
  <RouterProvider router={router}/>
  </>

)