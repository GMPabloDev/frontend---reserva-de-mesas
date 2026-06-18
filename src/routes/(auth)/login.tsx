
import { LoginUserForm } from '#/components/custom/auth/LoginUserForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>

    <p>Iniciar sesión</p>
    <LoginUserForm />
  </div>
}
