// PrivateRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Preloader from './Preloader';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      const sessionKey = getSessionKeyFromCookie('session_key');
      if (sessionKey) {
        const { checkAuthentication } = useAuthentication(sessionKey);
        const authStatus = await checkAuthentication();
        setIsAuthenticated(authStatus);
      } else {
        setIsAuthenticated(false);
      }
    };
    authenticate();
  }, []);

  if (isAuthenticated === null) {
    return <Preloader />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
