import { createFileRoute } from '@tanstack/react-router'
import { RegisterUserForm } from '#/components/custom/auth/RegisterUserForm'

export const Route = createFileRoute('/(auth)/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>

      <div>Hello "/(auth)/register"!</div>
      <RegisterUserForm />
    </>
  )
}
