import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!isAuthenticated ? 
            <Login setAuth={setAuth} /> : 
            <Navigate to="/home" replace />
          } 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? 
            <Register setAuth={setAuth} /> : 
            <Navigate to="/home" replace />
          } 
        />
        <Route
          path="/home"
          element={isAuthenticated ? 
            <Home setAuth={setAuth} /> : 
            <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
