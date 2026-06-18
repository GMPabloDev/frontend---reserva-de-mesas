import { z } from "zod"


export const resendOTPSchema = z.object({
    email: z.string().email(),
    type: z.string(),
})

export type ResendOTPRequest = z.infer<typeof resendOTPSchema>