import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home";
import { Layout } from "./components/layout";
import { Car } from "./pages/car";
import { Dashboard } from "./pages/dashbord";
import { New } from "./pages/dashbord/new";
import { Register } from "./pages/register";
import { Login } from "./pages/login";

const router = createBrowserRouter([
  {
    element: <Layout />, children: [
      { path: "/", element: <Home /> },
      { path: "/car:id", element: <Car /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/new", element: <New /> },

    ]
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> }
])

export { router }