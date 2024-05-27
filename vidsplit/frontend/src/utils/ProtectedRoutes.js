import { Outlet, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/oauth2/discord/getuser", {
          method: "GET",
          credentials: "include", // Ensures cookies are included in the request
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if the user is not authenticated
            setRedirectTo("/login");
          } else {
            throw new Error("Network response was not ok");
          }
          return;
        }

        const user = await response.json();
        console.log("User details:", user); // Debugging

        if (user && user.has_access === true) {
          setIsAuthorized(true);
        } else {
          setRedirectTo("/notauthorized");
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setRedirectTo("/login");
      }
    };

    checkAuth();
  }, []);

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
