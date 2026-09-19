import ReactDom from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';
import Inscrit from './Composant/Inscrit';
import { Toaster } from 'react-hot-toast';
import Connexion from './Composant/Connexion';

const route = createBrowserRouter ([
  {
    path:"acceuil",
    element:<App/>
  },
  {
    path:"inscrit",
    element:<Inscrit/>
  },
  {
    path:"conne",
    element:<Connexion/>
  }
])

ReactDom.createRoot(document.getElementById("root")).render(
  <>
  <Toaster/>
  <RouterProvider router={route} />
  </>

)