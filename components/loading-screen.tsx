"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import EcliptixLogo from "./ecliptix-logo"

interface LoadingScreenProps {
  onComplete?: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 2800
    const interval = 30
    const steps = duration / interval
    let step = 0

    const timer = setInterval(() => {
      step++
      // Eased progress — accelerates then decelerates
      const t = step / steps
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setProgress(Math.min(Math.round(eased * 100), 100))

      if (step >= steps) {
        clearInterval(timer)
        setProgress(100)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center"
      exit={{
        clipPath: [
          "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
        ],
      }}
      transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
    >
      {/* Logo drawing animation */}
      <div className="w-[50vw] max-w-lg mb-12">
        <EcliptixLogo animate={true} disableHover={true} />
      </div>

      {/* Progress counter and bar */}
      <div className="flex flex-col items-center gap-4 w-[50vw] max-w-lg">
        <div className="w-full h-px bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-white"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Initializing Decks
        </span>
        <span className="font-mono text-sm text-muted-foreground tabular-nums tracking-widest">
          {String(progress).padStart(3, "0")}%
        </span>
      </div>
    </motion.div>
  )
}
