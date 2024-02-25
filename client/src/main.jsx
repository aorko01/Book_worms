import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { RouterProvider, createBrowserRouter,createRoutesFromElements } from "react-router-dom";


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/Login" element={<Login />} />,
//   )
// );

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
