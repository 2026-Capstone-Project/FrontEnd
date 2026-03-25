import { useEffect, useRef, useState } from 'react'

export const useThrottledValue = <T>(value: T, delay = 150) => {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdatedAtRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const now = Date.now()
    const effectiveDelay = Math.max(delay, 0)
    const remainingTime = effectiveDelay - (now - lastUpdatedAtRef.current)
    const nextDelay = remainingTime <= 0 ? 0 : remainingTime

    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setThrottledValue(value)
      lastUpdatedAtRef.current = Date.now()
      timeoutRef.current = null
    }, nextDelay)

    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [delay, value])

  return throttledValue
}
