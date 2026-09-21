import { useMutation } from "@tanstack/react-query";
import { requestLoginOtp } from "../api/auth.api.js";

export const useRequestLoginOtp = () => {
    return useMutation({
        mutationFn: requestLoginOtp,
    });
};
