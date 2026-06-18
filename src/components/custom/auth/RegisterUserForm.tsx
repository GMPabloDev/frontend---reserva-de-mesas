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
import { registerUserSchema } from '#/features/auth/schemas/register-user.schema'
import { useRegisterUser } from '#/features/auth/hooks/use-register-user'

export function RegisterUserForm() {
    const router = useRouter()
    const { registerUserMutation } = useRegisterUser()

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validators: {
            onSubmit: registerUserSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                const result = await registerUserMutation.mutateAsync({
                    name: value.name,
                    email: value.email,
                    password: value.password,
                    confirmPassword: value.confirmPassword,
                })

                toast.success(result.data.messageSpanish, {
                    position: 'bottom-right',
                })

                // Redirige a /verify-email?email=...
                await router.navigate({
                    to: '/verify-email',
                    search: { email: value.email },
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
                <CardTitle>Crear cuenta</CardTitle>
                <CardDescription>
                    Ingresa tus datos para registrarte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="register-user-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <FieldGroup>
                        {/* campo name */}
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="John Doe"
                                            autoComplete="off"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* campo email */}
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

                        {/* campo confirmPassword */}
                        <form.Field name="confirmPassword">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Confirmar Contraseña</FieldLabel>
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
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    type="submit"
                    form="register-user-form"
                    disabled={registerUserMutation.isPending}
                >
                    {registerUserMutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
            </CardFooter>
        </Card >
    )
}