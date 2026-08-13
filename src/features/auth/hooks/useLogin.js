import { useMutation } from "@tanstack/react-query";

import { loginOwner } from "../api/auth.api.js";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginOwner,
  });
};