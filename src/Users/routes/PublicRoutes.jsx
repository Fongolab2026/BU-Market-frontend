import Home from "../Pages/Home.jsx";
import Inscription from "../auth/Inscription.jsx";
import Connexion from "../auth/Connexion.jsx";
import PageErreur from "../Pages/PageErreur.jsx";

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
    path: "*",
    element: <PageErreur />
    }
];