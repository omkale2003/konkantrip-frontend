import { useCallback, useState } from "react";

import tokenService from "../../../services/token.service.js";
import storageService from "../../../services/storage.service.js";

export const useAuth = () => {
  const [owner, setOwner] = useState(() => {
    return storageService.getOwner();
  });

  const isAuthenticated = tokenService.hasToken();

  const logout = useCallback(() => {
    tokenService.removeToken();
    storageService.removeOwner();
    setOwner(null);
  }, []);

  return {
    owner,
    isAuthenticated,
    logout,
  };
};