import type { LoginUserRequest } from "../../schemas/login-user.schema"


export const loginUser = async (data: LoginUserRequest) => {
    const response = await fetch('http://localhost:8082/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error?.message ?? 'Error al iniciar sesion')
    }

    const result = await response.json() as {
        success: boolean
        data: { accessToken: string; refreshToken: string }
    }
    return result
}