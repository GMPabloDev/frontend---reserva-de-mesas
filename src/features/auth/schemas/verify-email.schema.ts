import { z } from 'zod'

export const verifyEmailSchema = z.object({
    email: z.string().email("El correo electrónico no es válido"),
    otp: z.string().min(6, "El código de verificación debe tener al menos 6 caracteres"),
})

export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>