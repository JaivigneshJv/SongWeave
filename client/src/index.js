import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Notfound from "./components/Notfound";


const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/:folder",
    element: <App />,
  },
  {
    path: "/notfound",
    element: <Notfound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
