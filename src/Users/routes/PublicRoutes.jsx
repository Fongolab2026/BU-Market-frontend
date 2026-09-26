import Inscription from "../auth/Inscription.jsx";
import Connexion from "../auth/Connexion.jsx";
import PageErreur from "../Pages/PageErreur.jsx";

export const publicRoutes = [
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