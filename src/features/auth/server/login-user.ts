// verify-email.server.ts
import { createServerFn } from "@tanstack/react-start"
import { setCookie } from "@tanstack/react-start/server"
import { loginUser } from "../api/login/login-user.api"
import { loginUserSchema } from "../schemas/login-user.schema"

export const loginUserFn = createServerFn({ method: 'POST' })
    .validator(loginUserSchema)
    .handler(async ({ data }) => {

        const result = await loginUser(data)

        // accessToken en memoria (cookie de sesión, sin httpOnly para que JS lo lea)
        setCookie('accessToken', result.data.accessToken, {
            path: '/',
            sameSite: 'strict',
            secure: true,
            maxAge: 60 * 15, // 15 minutos
        })

        // refreshToken httpOnly: JS del browser nunca lo puede leer ni robar
        setCookie('refreshToken', result.data.refreshToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: true,
            maxAge: 60 * 60 * 24 * 7, // 7 días
        })

        // No retornes los tokens al cliente
        return { success: true }
    })