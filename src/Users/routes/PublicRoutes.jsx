import Inscription from "../auth/Inscription.jsx";
import Connexion from "../auth/Connexion.jsx";
import LouerEspace from "../Pages/LouerEspace.jsx";
import Profil from "../Pages/Profil.jsx";
import ConfirmationLocation from "../Pages/ConfirmationLocation.jsx";
import PageErreur from "../Pages/PageErreur.jsx";
import RequireNoOpenRequest from "./RequireNoOpenRequest.jsx";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../services/api";
import { ConnexionAdminPage } from "../../pages/admin/modules/auth/pages/ConnexionAdminPage.jsx";
import { AccesRefuseAdminPage } from "../../pages/admin/modules/auth/pages/AccesRefuseAdminPage.jsx";

function RequireAuth() {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
}

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
        element: <RequireAuth />,
        children: [
            {
                path: "louer-espace",
                element: (
                    <RequireNoOpenRequest>
                        <LouerEspace />
                    </RequireNoOpenRequest>
                )
            },
            {
                path: "confirmation-location",
                element: <ConfirmationLocation />
            },
            {
                path: "profil",
                element: <Profil />
            }
        ]
    },
    {
        path: "admin/connexion",
        element: <ConnexionAdminPage />
    },
    {
        path: "admin/acces-refuse",
        element: <AccesRefuseAdminPage />
    },
    {
        path: "*",
        element: <PageErreur />
    }
];