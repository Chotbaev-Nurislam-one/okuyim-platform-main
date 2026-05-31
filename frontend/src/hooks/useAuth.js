import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const sessionExpiry = localStorage.getItem("sessionExpiry");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    // Check if session has expired
    if (sessionExpiry && sessionExpiry !== "session") {
      const expiryDate = new Date(sessionExpiry);
      const now = new Date();

      if (now > expiryDate) {
        // Session expired
        logout();
        setIsLoading(false);
        return;
      }
    }

    if (userData && token) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAuthenticated(true);
    } else if (
      sessionStorage.getItem("sessionExpiry") === "session" &&
      userData &&
      token
    ) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionExpiry");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("sessionExpiry");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    checkAuth,
  };
};
