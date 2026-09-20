import Home from "../pages/Home.jsx";
import Inscription from "../auth/Inscription.jsx";
import Connexion from "../auth/Connexion.jsx";
import PageErreur from "../Pages/PageErreur.jsx";
import DetailProduit from "../Pages/DetailProduit.jsx";

export const publicRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: "inscription",
        element: <Inscription />
    },
    {
        path: "connexion",
        element: <Connexion />
    },
    {
        path:"produit/:id",
        element:<DetailProduit/>
    },
    {
    path: "*",
    element: <PageErreur />
    }
];