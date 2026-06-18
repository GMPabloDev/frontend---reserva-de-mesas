
import type { VerifyEmailRequest } from "../../schemas/verify-email.schema"


export const verifyEmail = async (data: VerifyEmailRequest) => {
    const response = await fetch('http://localhost:8080/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error?.message ?? 'Error al verificar correo electrónico')
    }

    const result = await response.json() as {
        success: boolean
        data: { accessToken: string; refreshToken: string }
    }
    return result
}