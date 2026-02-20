"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { EventData } from "@/lib/events"
import type { GalleryItem } from "./page"

function WordReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(" ")
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.08,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  )
}

function videoPoster(src: string): string | undefined {
  // Cloudinary: insert transformation to grab first frame as a jpg
  const m = src.match(/^(https:\/\/res\.cloudinary\.com\/.+\/video\/upload\/)(v\d+\/.+)\.\w+$/)
  if (m) return `${m[1]}so_0,w_480,f_jpg/${m[2]}.jpg`
  return undefined
}

function VideoTile({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(true)

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        poster={videoPoster(src)}
        preload="metadata"
        playsInline
        className={className}
        onEnded={() => setPaused(true)}
      />
      <button
        onClick={toggle}
        className="absolute inset-0 m-auto z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-black/70 transition-all"
        aria-label={paused ? "Play" : "Pause"}
      >
        {paused ? <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5" /> : <Pause className="w-4 h-4 md:w-5 md:h-5" />}
      </button>
    </div>
  )
}

export default function GalleryClient({ event, items }: { event: EventData; items: GalleryItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % items.length)
  }, [lightboxIndex, items.length])

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)
  }, [lightboxIndex, items.length])

  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lightboxIndex, goNext, goPrev])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-white selection:text-black">
      {/* ── Back navigation ─────────────────────────────────── */}
      <Link
        href="/#tour"
        className="fixed top-4 left-4 md:top-8 md:left-8 z-40 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </Link>

      {/* ── Hero area ───────────────────────────────────────── */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter uppercase">
              <WordReveal text={event.event} />
            </h1>

            <div className="mt-4 md:mt-6 flex flex-wrap items-center gap-3 md:gap-6">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-mono text-xs md:text-sm text-muted-foreground"
              >
                {event.date}
              </motion.span>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.35 }}
                className="text-white"
              >
                /
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-sm md:text-lg font-light"
              >
                {event.venue}
              </motion.span>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.45 }}
                className="text-white"
              >
                /
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="font-mono text-xs uppercase tracking-wider border border-current px-2 py-0.5 rounded-full"
              >
                {event.city}
              </motion.span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Media grid ─────────────────────────────────────── */}
      <section className="py-8 md:py-16 px-4 md:px-16">
        <div className="max-w-7xl mx-auto columns-2 md:columns-3 gap-3 md:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
              animate={{
                opacity: 1,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              }}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.1,
                ease: [0.77, 0, 0.175, 1],
              }}
              className="mb-3 md:mb-4 break-inside-avoid group"
              onClick={() => openLightbox(i)}
            >
              <div className={`relative overflow-hidden cursor-pointer ${item.type === "video" ? "" : "bg-white/5"}`}>
                {item.type === "video" ? (
                  <VideoTile
                    src={item.url}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={`${item.url}?tr=w-400,q-80`}
                    alt={`${event.event} — Photo ${i + 1}`}
                    width={item.width}
                    height={item.height}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
              Gallery coming soon
            </p>
          </div>
        )}
      </section>

      {/* ── Lightbox ────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 p-2 text-white/40 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 p-2 text-white/40 hover:text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Media */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[90vw] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {items[lightboxIndex].type === "video" ? (
                <video
                  src={items[lightboxIndex].url}
                  poster={videoPoster(items[lightboxIndex].url)}
                  preload="metadata"
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-[85vh] object-contain"
                />
              ) : (
                <Image
                  src={items[lightboxIndex].url}
                  alt={`${event.event} — Photo ${lightboxIndex + 1}`}
                  width={1600}
                  height={1200}
                  className="max-w-full max-h-[85vh] object-contain"
                  sizes="90vw"
                  priority
                />
              )}
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40 tracking-widest">
              {lightboxIndex + 1} / {items.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
