import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../api/register/register-user.api"

export const useRegisterUser = () => {

  const mutation = useMutation({
    mutationFn: registerUser,
  })

  return {
    registerUserMutation: mutation,
  }
}