"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState("")
  const [isTouch, setIsTouch] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Detect touch device
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
    if (isTouchDevice) {
      setIsTouch(true)
      return
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const hoverEl = target.closest("a, button, [data-cursor-hover]")
      const imageEl = target.closest("[data-cursor-view]")

      if (imageEl) {
        setIsHovering(true)
        setCursorText(imageEl.getAttribute("data-cursor-view") || "VIEW")
      } else if (hoverEl) {
        setIsHovering(true)
        setCursorText("")
      } else {
        setIsHovering(false)
        setCursorText("")
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [cursorX, cursorY, isVisible])

  if (isTouch) return null

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[10000] pointer-events-none mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white flex items-center justify-center"
          animate={{
            width: isHovering ? (cursorText ? 80 : 48) : 8,
            height: isHovering ? (cursorText ? 80 : 48) : 8,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {cursorText && (
            <motion.span
              className="text-black text-xs font-mono font-bold uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border border-white/50"
          animate={{
            width: isHovering ? 0 : 32,
            height: isHovering ? 0 : 32,
            opacity: isVisible ? (isHovering ? 0 : 0.5) : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>
    </>
  )
}
