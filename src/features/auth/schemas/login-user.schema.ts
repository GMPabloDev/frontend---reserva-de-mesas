import { z } from "zod"

export const loginUserSchema = z.object({
    email: z.string().email("El correo electrónico no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export type LoginUserRequest =
  z.infer<typeof loginUserSchema>