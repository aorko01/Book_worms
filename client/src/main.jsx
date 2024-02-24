import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Home from "./components/Home/HomePage.jsx";
import { RouterProvider, createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import router from "../../server/routes/home.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/Login" element={<Login />} />,
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   <RouterProvider router={router}/>
  </React.StrictMode>
);
