// src/routes/(auth)/verify-email.tsx
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import z from 'zod'
import { verifyEmailSchema } from '#/features/auth/schemas/verify-email.schema'
import { verifyEmailFn } from '#/features/auth/server/verify-email'
import { useResendOtp } from '#/features/auth/hooks/use-resend-otp'

const verifyEmailSearchSchema = z.object({
    email: z.string().email(),
})

export const Route = createFileRoute('/(auth)/verify-email')({
    validateSearch: verifyEmailSearchSchema,
    onError: () => {
        throw redirect({ to: '/login' })
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { email } = Route.useSearch()
    const router = useRouter()
    const {
        resendOtpMutation,
        isCooldownActive,
        formattedTime,
    } = useResendOtp({
        storageKey: email,
    })


    const form = useForm({
        defaultValues: {
            email: email,
            otp: '',
        },
        validators: {
            onSubmit: verifyEmailSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await verifyEmailFn({
                    data: {
                        email: value.email,
                        otp: value.otp,
                    },
                })

                toast.success('Email verificado correctamente', {
                    position: 'bottom-right',
                })

                await router.navigate({ to: '/' })
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'Error al verificar el código',
                    { position: 'bottom-right' }
                )
                // Resetear el campo de código en caso de error
                form.setFieldValue('otp', '')
            }
        },
    })

    const handleResendCode = async () => {
        try {
            await resendOtpMutation.mutateAsync({
                email,
                type: "EMAIL_VERIFICATION",
            })
        } catch (error) {
            // OtpCooldownError también es instanceof Error, así que esto sigue funcionando
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Error al reenviar el código",
                { position: "bottom-right" }
            )
        }
    }

    return (
        <div>
            <Card className="mx-auto max-w-md">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <CardHeader>
                        <CardTitle>Verifica tu inicio de sesión</CardTitle>
                        <CardDescription>
                            Introduce el código de verificación que te enviamos a tu dirección de correo electrónico:{" "}
                            <span className="font-medium">{email}</span>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form.Field name="otp">
                            {(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>

                                        <InputOTP
                                            maxLength={6}
                                            id="otp-verification"
                                            required
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(value) => field.handleChange(value)}
                                            aria-invalid={isInvalid}
                                        >
                                            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-15 *:data-[slot=input-otp-slot]:w-14 *:data-[slot=input-otp-slot]:text-2xl">
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator className="mx-2" />
                                            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-15 *:data-[slot=input-otp-slot]:w-14 *:data-[slot=input-otp-slot]:text-2xl">
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        </form.Field>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full space-y-4 mt-2">
                            <form.Subscribe selector={(s) => s.isSubmitting}>
                                {(isSubmitting) => (
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Verificando...' : 'Verificar'}
                                    </Button>
                                )}
                            </form.Subscribe>
                            <div className="flex flex-col items-center gap-1 w-full">
                               

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={handleResendCode}
                                    disabled={resendOtpMutation.isPending || isCooldownActive}
                                >
                                    <RefreshCwIcon />
                                    {isCooldownActive ? `Para solicitar un nuevo código, espera ${formattedTime}` : "Reenviar código"}
                                </Button>
                            </div>
                            <div className="text-sm text-muted-foreground text-center">
                                ¿Tienes problemas para verificar?{" "}
                                <a
                                    href="#"
                                    className="underline underline-offset-4 transition-colors hover:text-primary"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        // Lógica para contacto con soporte
                                    }}
                                >
                                    Ponte en contacto con soporte.
                                </a>
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}