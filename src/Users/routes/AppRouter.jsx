import { createBrowserRouter } from "react-router-dom";
import App from "../../App.jsx";
import Inscription from "../auth/Inscription.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "/inscription",
        element: <Inscription />
    }
]);


