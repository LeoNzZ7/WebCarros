import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home";
import { Layout } from "./components/layout";
import { Car } from "./pages/car";
import { Dashboard } from "./pages/dashbord";
import { New } from "./pages/dashbord/new";
import { Register } from "./pages/register";
import { Login } from "./pages/login";
import { Private } from "./routes/private";

const router = createBrowserRouter([
  {
    element: <Layout />, children: [
      { path: "/", element: <Home /> },
      { path: "/car/:id", element: <Car /> },
      { path: "/dashboard", element: <Private><Dashboard /></Private> },
      { path: "/dashboard/new", element: <Private><New /></Private> },

    ]
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> }
])

export { router }