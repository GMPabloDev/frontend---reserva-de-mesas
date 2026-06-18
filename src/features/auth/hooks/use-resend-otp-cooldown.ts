import { useCallback, useEffect, useRef, useState } from "react"

interface UseResendOtpCooldownOptions {
    /** Key única en localStorage. Útil si hay varios flujos OTP (registro, reset password, etc.) */
    storageKey: string
}

interface UseResendOtpCooldownResult {
    isCooldownActive: boolean
    secondsLeft: number
    /** Formateado como "1:05" o "0:45" (mm:ss, sin ceros a la izquierda en minutos) */
    formattedTime: string
    /** Inicia (o reinicia) el cooldown por N segundos y lo persiste */
    startCooldown: (seconds: number) => void
    /** Limpia el cooldown manualmente (por si lo necesitas) */
    clearCooldown: () => void
}

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/**
 * Maneja el countdown de un cooldown de OTP persistido en localStorage.
 * Guarda el timestamp absoluto (cooldownEndsAt) en vez de "segundos restantes",
 * para que el cálculo sea correcto sin importar cuánto tiempo estuvo
 * la pestaña en background o si el usuario hace F5.
 */
export const useResendOtpCooldown = ({ storageKey }: UseResendOtpCooldownOptions): UseResendOtpCooldownResult => {
    const fullKey = `otp-cooldown:${storageKey}`
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const computeSecondsLeft = useCallback((): number => {
        if (typeof window === "undefined") {
            return 0
        }

        const stored = localStorage.getItem(fullKey)

        if (!stored) return 0

        const cooldownEndsAt = Number(stored)

        if (Number.isNaN(cooldownEndsAt)) {
            return 0
        }

        const diff = Math.ceil((cooldownEndsAt - Date.now()) / 1000)

        return Math.max(0, diff)
    }, [fullKey])

    const [secondsLeft, setSecondsLeft] = useState(0)

    const clearInterval_ = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const clearCooldown = useCallback(() => {
        localStorage.removeItem(fullKey)
        clearInterval_()
        setSecondsLeft(0)
    }, [fullKey])

    const tick = useCallback(() => {
        const remaining = computeSecondsLeft()
        setSecondsLeft(remaining)
        if (remaining <= 0) {
            clearInterval_()
            localStorage.removeItem(fullKey)
        }
    }, [computeSecondsLeft, fullKey])

    const startCooldown = useCallback((seconds: number) => {
        if (seconds <= 0) return

        const cooldownEndsAt = Date.now() + seconds * 1000
        localStorage.setItem(fullKey, String(cooldownEndsAt))
        setSecondsLeft(seconds)

        clearInterval_()
        intervalRef.current = setInterval(tick, 1000)
    }, [fullKey, tick])

    // Al montar: si ya había un cooldown corriendo (ej. F5), lo retomamos.
    useEffect(() => {
        tick()

        const remaining = computeSecondsLeft()

        if (remaining > 0) {
            intervalRef.current = setInterval(tick, 1000)
        }

        return () => clearInterval_()
    }, [computeSecondsLeft, tick])

    return {
        isCooldownActive: secondsLeft > 0,
        secondsLeft,
        formattedTime: formatTime(secondsLeft),
        startCooldown,
        clearCooldown,
    }
}