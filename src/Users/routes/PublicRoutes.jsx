import Home from "../pages/Home.jsx";
import Inscription from "../auth/Inscription.jsx";
import Connexion from "../auth/Connexion.jsx";
import PageErreur from "../Pages/PageErreur.jsx";
import Detail from "../../Admin/Approuver_Demande.jsx";

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
        path:"detail",
        element:<Detail/>
    },
    {
    path: "*",
    element: <PageErreur />
    }
];