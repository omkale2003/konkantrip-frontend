import { useMutation } from "@tanstack/react-query";
import { employeeLogin } from "../api/employeeAuth.api.js";

export const useEmployeeLogin = () => {
  return useMutation({
    mutationFn: (credentials) => employeeLogin(credentials),
  });
};
