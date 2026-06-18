import { z } from "zod"

export const registerUserSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("El correo electrónico no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La confirmación de contraseña debe tener al menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export type RegisterUserRequest =
  z.infer<typeof registerUserSchema>