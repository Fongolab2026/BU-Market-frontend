import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../services/api.js";
import Crud_Users from "../../Admin/Crud_Users.jsx";
import Detail from "../../Admin/Approuver_Demande.jsx";
import Liste from "../../Admin/Liste_Produit.jsx";

const ProtectedRoute = () => {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/connexion" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export const protectedRoutes = [
    {
        element: <ProtectedRoute />,
        children: [
            { path: "admin", element: <Crud_Users /> },
            { path: "approbation-demandes", element: <Detail /> },
            { path: "liste-produits", element: <Liste /> }
        ]
    }
];