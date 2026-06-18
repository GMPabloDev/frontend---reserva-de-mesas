import { useMutation } from "@tanstack/react-query"
import { resendOtp, OtpCooldownError } from "../api/resend-otp/resend-otp.api"
import { useResendOtpCooldown } from "./use-resend-otp-cooldown"

interface UseResendOtpOptions {
    /** Diferencia el storage si este hook se usa en más de un flujo (ej. email distinto) */
    storageKey?: string
}

export const useResendOtp = ({ storageKey = "email-verification" }: UseResendOtpOptions = {}) => {
    const cooldown = useResendOtpCooldown({ storageKey })

    const mutation = useMutation({
        mutationFn: resendOtp,
        onSuccess: () => {
            // El backend reinicia su propio cooldown (2 min) tras un resend exitoso
            cooldown.startCooldown(120)
        },
        onError: (error) => {
            // Si el cooldown ya estaba activo en backend pero el frontend lo perdió
            // (otra pestaña, storage borrado, etc.), lo resincronizamos.
            if (error instanceof OtpCooldownError) {
                cooldown.startCooldown(error.secondsLeft)
            }
        },
    })

    return {
        resendOtpMutation: mutation,
        ...cooldown,
    }
}