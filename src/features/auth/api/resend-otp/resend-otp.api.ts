import type { ResendOTPRequest } from "../../schemas/resend-otp.schema"

interface ApiErrorResponse {
    timestamp: string
    status: number
    error: string
    message: string
    details: string[]
}

export class OtpCooldownError extends Error {
    public readonly secondsLeft: number

    constructor(message: string, secondsLeft: number) {
        super(message)
        this.name = "OtpCooldownError"
        this.secondsLeft = secondsLeft
    }
}


const COOLDOWN_PATTERNS = [
    /espere\s+(\d+)\s+segundos/i,
    /wait\s+(\d+)\s+seconds/i,
]

const extractCooldownSeconds = (message: string): number | null => {
    for (const pattern of COOLDOWN_PATTERNS) {
        const match = message.match(pattern)
        if (match) return Number(match[1])
    }
    return null
}

export const resendOtp = async (data: ResendOTPRequest) => {
    const response = await fetch('http://localhost:8080/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json() as Partial<ApiErrorResponse>
        const message = error?.message ?? 'Error al generar nuevo código'

        const cooldownSeconds = extractCooldownSeconds(message)

        console.log('Cooldown seconds extracted:', cooldownSeconds)

        if (cooldownSeconds !== null) {
            throw new OtpCooldownError(message, cooldownSeconds)
        }

        throw new Error(message)
    }

    return await response.json() as {
        success: boolean
        data: { message: string; messageSpanish: string }
    }
}