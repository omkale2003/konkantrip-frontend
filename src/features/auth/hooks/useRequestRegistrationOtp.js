import { useMutation } from "@tanstack/react-query";
import { requestRegistrationOtp } from "../api/auth.api.js";

export const useRequestRegistrationOtp = () => {
    return useMutation({
        mutationFn: requestRegistrationOtp,
    });
};
