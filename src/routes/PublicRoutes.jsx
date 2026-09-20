import Home from "../pages/home/Home.jsx";
import Inscription from "../pages/auth/Inscription.jsx";
import Connexion from "../pages/auth/Connexion.jsx";

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