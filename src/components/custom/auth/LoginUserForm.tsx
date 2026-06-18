// src/components/RegisterUserForm.tsx
import { useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle,
} from '#/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { loginUserSchema } from '#/features/auth/schemas/login-user.schema'
import { loginUserFn } from '#/features/auth/server/login-user'

export function LoginUserForm() {
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onSubmit: loginUserSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await loginUserFn({
                    data: {
                        email: value.email,
                        password: value.password
                    }
                })

                toast.success("Bienvenido a la cevicheria el olimpico", {
                    position: 'bottom-right',
                })

                // Redirige a /verify-email?email=...
                await router.navigate({
                    to: '/',
                })
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'Error inesperado',
                    { position: 'bottom-right' }
                )
            }
        },
    })

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Iniciar sesión</CardTitle>
                <CardDescription>
                    Ingresa tus datos para iniciar sesión.
                </CardDescription>
            </CardHeader>
            <form
                id="register-user-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <CardContent>

                    <FieldGroup>
                        <form.Field name="email">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Correo</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="you@example.com"
                                            autoComplete="off"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* campo password */}
                        <form.Field name="password">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="••••••••"
                                            autoComplete="off"
                                            type="password"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        </form.Field>


                    </FieldGroup>
                </CardContent>
                <CardFooter>
                    <form.Subscribe selector={(s) => s.isSubmitting}>
                        {(isSubmitting) => (
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'ingresando...' : 'Iniciar sesion'}
                            </Button>
                        )}
                    </form.Subscribe>
                </CardFooter>
            </form>

        </Card >
    )
}