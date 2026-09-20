import Home from "../pages/Home.jsx";
import Inscription from "../auth/Inscription.jsx";
import Connexion from "../auth/Connexion.jsx";

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
    }
];