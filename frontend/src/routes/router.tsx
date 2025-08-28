import { createBrowserRouter } from "react-router-dom";
import Home from "@pages/Home/Home";
import Login from "@pages/Login/Login";
import Register from "@pages/Register/Register";
import Events from "@pages/Events/Events";
import NotFound from "@pages/NotFound/NotFound";
import ForgotPasswordPage from "@pages/ForgotPassword/ForgotPasswordPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;