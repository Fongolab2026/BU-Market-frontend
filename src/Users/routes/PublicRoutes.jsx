import Inscription from "../auth/Inscription.jsx";
import Connexion from "../auth/Connexion.jsx";
import LouerEspace from "../Pages/LouerEspace.jsx";
import ConfirmationLocation from "../Pages/ConfirmationLocation.jsx";
import PageErreur from "../Pages/PageErreur.jsx";
import RequireNoOpenRequest from "./RequireNoOpenRequest.jsx";
import { ConnexionAdminPage } from "../../pages/admin/modules/auth/pages/ConnexionAdminPage.jsx";
import { AccesRefuseAdminPage } from "../../pages/admin/modules/auth/pages/AccesRefuseAdminPage.jsx";

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