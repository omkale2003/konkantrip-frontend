import { Navigate, Outlet, useLocation } from "react-router-dom";

import tokenService from "../../../services/token.service.js";

function ProtectedRoute() {
  const location = useLocation();

  const token = tokenService.getToken();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;