import { useMutation } from "@tanstack/react-query";

import { registerOwner } from "../api/auth.api.js";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerOwner,
  });
};