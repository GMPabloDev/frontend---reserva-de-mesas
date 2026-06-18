import type { RegisterUserRequest } from "../../schemas/register-user.schema";

export async function registerUser(data: RegisterUserRequest) {
    
    const sendData = {
        name: data.name,
        email: data.email,
        password: data.password,
    }

    const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error?.message ?? 'Error al registrar usuario')
    }

    return await response.json() as {
        success: boolean
        data: { message: string; messageSpanish: string }
    }
}