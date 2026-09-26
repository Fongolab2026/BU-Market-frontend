import Inscription from "../auth/Inscription.jsx";
import Connexion from "../auth/Connexion.jsx";
import LouerEspace from "../Pages/LouerEspace.jsx";
import ConfirmationLocation from "../Pages/ConfirmationLocation.jsx";
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
        path: "louer-espace",
        element: <LouerEspace />
    },
    {
        path: "confirmation-location",
        element: <ConfirmationLocation />
    },
    {
        path: "*",
        element: <PageErreur />
    }
];