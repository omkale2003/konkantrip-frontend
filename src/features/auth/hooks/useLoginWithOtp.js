import { useMutation } from "@tanstack/react-query";
import { loginWithOtp } from "../api/auth.api.js";

export const useLoginWithOtp = () => {
    return useMutation({
        mutationFn: loginWithOtp,
    });
};
