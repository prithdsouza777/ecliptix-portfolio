"use client"

import { useRef, useState, useEffect } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion"
import { ArrowRight, Mail, Phone, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"
import EcliptixLogo from "@/components/ecliptix-logo"
import Lenis from "lenis"
import { LogoLoop } from "@/components/LogoLoop"
import MuxVideo from "@/components/mux-video"

// ── Word-by-word reveal component ──────────────────────────────────
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
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
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

// ── Section title component with staggered word reveal ─────────────
function SectionTitle({
  children,
  className = "",
}: {
  children: string
  className?: string
}) {
  const lines = children.split("\n")
  return (
    <>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx}>
          {lineIdx > 0 && <br />}
          <WordReveal text={line} delay={lineIdx * 0.15} className={className} />
        </span>
      ))}
    </>
  )
}

// ── Magnetic button component ──────────────────────────────────────
function MagneticButton({
  children,
  className = "",
  href,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Tag = href ? "a" : "button"

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Tag
        href={href}
        onClick={onClick}
        className={className}
      >
        {children}
      </Tag>
    </motion.div>
  )
}

// ── Line draw component for tour dates ─────────────────────────────
function AnimatedLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="h-px bg-white/10 origin-left"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.33, 1, 0.68, 1] }}
    />
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLogo, setShowLogo] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [eventsPage, setEventsPage] = useState(0)

  // ── Lenis smooth scroll ─────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setShowLogo(true), 100)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // ── Hero parallax scroll ────────────────────────────────────────
  const heroRef = useRef(null)
  const releasesRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const logoY = useTransform(heroProgress, [0, 1], [0, -150])
  const taglineY = useTransform(heroProgress, [0, 1], [0, -50])
  const gridOpacity = useTransform(heroProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.95])

  // ── Staggered hero entrance ─────────────────────────────────────
  const heroEntrance = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const heroChild = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-white selection:text-black">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
          {/* ── Navigation ─────────────────────────────────────── */}
          <nav
            className={`fixed z-40 flex justify-between items-center transition-all duration-500 ${
              isScrolled
                ? "top-4 left-6 right-6 md:left-8 md:right-8 backdrop-blur-xl bg-black/50 border border-white/10 py-3 px-6 text-white"
                : "top-0 left-0 right-0 p-6 md:p-8 mix-blend-difference text-white"
            }`}
          >
            <div
              className={`w-24 h-6 md:h-8 group cursor-pointer transition-all duration-500 ${
                isScrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <EcliptixLogo className="text-white" disableHover={true} />
            </div>

            <div className="hidden md:flex gap-8 font-mono text-xs tracking-widest uppercase">
              {[
                { label: "Highlights", href: "#work" },
                { label: "Events", href: "#tour" },
                { label: "Releases", href: "#blog" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link transition-all duration-300"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button className="md:hidden font-mono text-xs uppercase" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </nav>

          {/* ── Mobile Menu Overlay ────────────────────────────── */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-0 z-30 bg-background flex flex-col justify-center items-center gap-8 md:hidden"
              >
                {[
                  { label: "Highlights", href: "#work" },
                  { label: "Events", href: "#tour" },
                  { label: "Releases", href: "#blog" },
                  { label: "Contact", href: "#contact" },
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-4xl font-light tracking-tighter hover:text-muted-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Hero Section ────────────────────────────────────── */}
          <section ref={heroRef} className="min-h-screen flex flex-col justify-center px-6 md:px-16 pt-20 relative border-b border-white/10 overflow-hidden">
            {/* Animated gradient blobs behind the grid */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[120px]"
                style={{ animation: "gradient-blob-1 12s ease-in-out infinite" }}
              />
              <div
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[100px]"
                style={{ animation: "gradient-blob-2 15s ease-in-out infinite" }}
              />
            </div>

            {/* Animated grid with pulse */}
            <motion.div
              style={{ opacity: gridOpacity }}
              className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />

            {/* Scan line sweep */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ animation: "scan-line 8s linear infinite" }}
              />
            </div>

            <motion.div
              style={{ scale: heroScale }}
              className="max-w-7xl w-full mx-auto z-10"
            >
              {/* Logo with parallax */}
              <div className="relative h-[12vw] min-h-[100px] max-h-[200px] flex items-center">
                <motion.div
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{ y: logoY }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="w-[60vw] md:w-[40vw] max-w-2xl"
                >
                  <EcliptixLogo animate={true} />
                </motion.div>
              </div>

              {/* Tagline and CTA with staggered word reveal + parallax */}
              <motion.div
                variants={heroEntrance}
                initial="hidden"
                animate="show"
                style={{ y: taglineY }}
                className="mt-12 grid md:grid-cols-2 gap-8 items-end"
              >
                <motion.div variants={heroChild}>
                  <WordReveal
                    text="Living in your reality."
                    className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed block"
                    delay={0.8}
                  />
                </motion.div>

                <motion.div variants={heroChild} className="flex gap-4 md:justify-end">
                  <MagneticButton
                    href="#work"
                    className="px-8 py-4 bg-foreground text-background font-mono text-sm uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 group"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>

          {/* ── Gradient divider ─────────────────────────────────── */}
          <div className="h-32 bg-gradient-to-b from-background via-white/[0.02] to-background" />

          {/* ── Latest Releases Section ────────────────────────── */}
          <section id="work" className="py-32 px-6 md:px-16 border-b border-white/10">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-16">
                <h2 className="text-4xl md:text-6xl font-light tracking-tighter">
                  <SectionTitle>EVENT HIGHLIGHTS</SectionTitle>
                </h2>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="hidden md:block font-mono text-sm text-muted-foreground"
                >
                  (2024 — 2026)
                </motion.span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {[
                  { title: "Raat Ka Rivaz", type: "Club Ecstasy, Manipal", playbackId: "apPdW3u201w2MZW36h2bekewZePawf4tMjDurBO7s2jQ", thumbnailTime: 0 },
                  { title: "Milan", type: "SJEC, Mangalore", playbackId: "hUCHyMqJtwifSRvN5CWqCZXbB1cVlIU2dNOeNs8Hw8E", thumbnailTime: 0 },
                  { title: "New Year's Eve", type: "Club Ecstasy, Manipal", playbackId: "8UtFZTKSYamKt00fKyUqLS01xumCm4ajpB02Do5BHPVvBA", thumbnailTime: 5 },
                  { title: "Blackout Affair", type: "Big Shot, Manipal", playbackId: "1SiHqKUbowFSV00Yf2GsNAo5WjtKfhSHSN2c1BOW7rzM", thumbnailTime: 0 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
                    whileInView={{
                      opacity: 1,
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.15,
                      ease: [0.77, 0, 0.175, 1],
                    }}
                    className="group"
                  >
                    <div className="relative overflow-hidden mb-4 bg-white/5">
                      <MuxVideo playbackId={item.playbackId} title={item.title} thumbnailTime={item.thumbnailTime} />
                    </div>
                    <div className="flex justify-between items-start border-t border-white/20 pt-4">
                      <div>
                        <h3 className="text-base md:text-2xl font-medium">{item.title}</h3>
                        <span className="text-xs md:text-sm text-muted-foreground font-mono">{item.type}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Gradient divider ─────────────────────────────────── */}
          <div className="h-24 bg-gradient-to-b from-background to-white/[0.03]" />

          {/* ── Recent Events Section ────────────────────────────── */}
          <section id="tour" className="py-32 px-6 md:px-16 bg-white/5 border-b border-white/10">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-light mb-16 tracking-tighter">
                <SectionTitle>RECENT EVENTS</SectionTitle>
              </h2>

              {(() => {
                const allEvents = [
                  { date: "FEB 14 '26", city: "Manipal", venue: "Big Shot", event: "Sweet Secret — Valentine's Day" },
                  { date: "JAN 24 '26", city: "Manipal", venue: "Big Shot", event: "Pink City" },
                  { date: "JAN 18 '26", city: "Manipal", venue: "Big Shot", event: "Sin City — Vol. II" },
                  { date: "JAN 11 '26", city: "Manipal", venue: "Big Shot", event: "Blackout Affair" },
                  { date: "DEC 31 '25", city: "Manipal", venue: "Ecstasy", event: "New Year's Eve" },
                  { date: "NOV 29 '25", city: "Manipal", venue: "Hakuna Matata", event: "One Last Dance" },
                  { date: "NOV 16 '25", city: "Mangalore", venue: "SJEC", event: "Hostel Day '25" },
                  { date: "NOV 13 '25", city: "Manipal", venue: "SJEC", event: "Tiara '25" },
                  { date: "OCT 10 '25", city: "Manipal", venue: "Ecstasy", event: "Badtameez Night" },
                  { date: "SEP 19 '25", city: "Manipal", venue: "Ecstasy", event: "Raat Ka Rivaz" },
                  { date: "AUG 08 '25", city: "Manipal", venue: "Hakuna Matata", event: "The Spotlight" },
                  { date: "MAY 31 '25", city: "Mangalore", venue: "SJEC", event: "Alvida '25" },
                  { date: "MAY 23 '25", city: "Mangalore", venue: "SJEC", event: "CSE Farewell" },
                  { date: "MAR 20 '25", city: "Mangalore", venue: "SJEC", event: "Tiara '25" },
                  { date: "MAR 11 '25", city: "Mangalore", venue: "SJEC", event: "Sports Day '25" },
                  { date: "NOV 22 '24", city: "Mangalore", venue: "SJEC", event: "ECE Branch Entry" },
                  { date: "NOV 20 '24", city: "Mangalore", venue: "SJEC", event: "Milan" },
                  { date: "OCT 26 '24", city: "Mangalore", venue: "SJEC", event: "Freshers Day '24" },
                  { date: "MAY 09 '24", city: "Mangalore", venue: "SJEC", event: "Tiara" },
                  { date: "SEP 04 '24", city: "Mangalore", venue: "SJEC", event: "Fresher's Day '24" },
                ];
                const perPage = 5;
                const totalPages = Math.ceil(allEvents.length / perPage);
                const visible = allEvents.slice(eventsPage * perPage, (eventsPage + 1) * perPage);

                return (
                  <>
                    <div className="space-y-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={eventsPage}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                        >
                          {visible.map((gig, i) => (
                            <div key={i}>
                              <AnimatedLine delay={i * 0.1} />
                              <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: i * 0.15,
                                  duration: 0.6,
                                  ease: [0.33, 1, 0.68, 1],
                                }}
                                className="group flex flex-col md:flex-row md:items-center justify-between py-8 hover:bg-white/[0.03] transition-all duration-300 px-4 -mx-4"
                              >
                                <div className="flex items-center gap-4 md:gap-8 md:w-auto md:min-w-fit">
                                  <span className="font-mono text-xs md:text-base opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {gig.date}
                                  </span>
                                  <span className="text-lg md:text-4xl font-bold uppercase truncate md:whitespace-nowrap">{gig.event}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between flex-1 mt-4 md:mt-0 md:pl-10">
                                  <span className="text-lg md:text-xl font-light">{gig.venue}</span>
                                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                                    <span className="font-mono text-xs uppercase tracking-wider border border-current px-2 py-1 rounded-full">
                                      {gig.city}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          ))}
                          <AnimatedLine delay={0.5} />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {totalPages > 1 && (
                      <div className="flex flex-col items-center mt-10 gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider opacity-40">
                          {eventsPage + 1} / {totalPages}
                        </span>
                        <button
                          onClick={() => setEventsPage((p) => (p + 1) % totalPages)}
                          className="group/arrow flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:border-white/60 hover:bg-white/5 transition-all duration-300"
                          aria-label="Show older events"
                        >
                          <ChevronDown className="w-5 h-5 opacity-50 group-hover/arrow:opacity-100 transition-opacity" />
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </section>

          {/* ── Gradient divider ─────────────────────────────────── */}
          <div className="h-24 bg-gradient-to-b from-white/[0.03] to-background" />

          {/* ── Latest Releases Section ──────────────────────────── */}
          <section id="blog" className="py-32 px-6 md:px-16 border-b border-white/10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <h2 className="text-4xl md:text-6xl font-light tracking-tighter">
                  <SectionTitle>LATEST RELEASES</SectionTitle>
                </h2>
                <a
                  href="https://www.youtube.com/@official.Ecliptix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono uppercase nav-link transition-all duration-300"
                >
                  View All
                </a>
              </div>

              <div className="relative group/carousel">
                <button
                  onClick={() => releasesRef.current?.scrollBy({ left: -400, behavior: "smooth" })}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-background/80 backdrop-blur-sm hover:border-white/60 hover:bg-white/10 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
                  aria-label="Previous releases"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                  ref={releasesRef}
                  className="flex gap-8 overflow-x-auto pb-4 releases-scroll"
                  onWheel={(e) => {
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                      e.currentTarget.scrollLeft += e.deltaY
                      e.preventDefault()
                    }
                  }}
                >
                  {[
                    { title: "Where You Are vs. Breakaway", type: "Mashup", videoId: "Q252URDVUbA" },
                    { title: "Waiting for Love vs. Quantum", type: "Mashup", videoId: "o8Xks89gPmc" },
                    { title: "Don't You Worry Child vs. The Only Way Is Up", type: "Mashup", videoId: "pqga2bbsJrY" },
                    { title: "Bom Diggy vs. Habibi", type: "Mashup", videoId: "Kp0BT-Ts9cg" },
                  ].map((release, i) => (
                    <motion.article
                      key={i}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        delay: i * 0.15,
                        duration: 0.6,
                        ease: [0.33, 1, 0.68, 1],
                      }}
                      className="group w-[75vw] md:w-[calc(33.333%-1.34rem)] flex-shrink-0"
                    >
                      <div className="aspect-video relative overflow-hidden mb-6 bg-white/5">
                        <iframe
                          src={`https://www.youtube.com/embed/${release.videoId}`}
                          title={release.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-0"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-mono text-muted-foreground uppercase">{release.type}</span>
                        <h3 className="text-xl font-medium leading-snug group-hover:text-stroke transition-all duration-300">
                          {release.title}
                        </h3>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <button
                  onClick={() => releasesRef.current?.scrollBy({ left: 400, behavior: "smooth" })}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-background/80 backdrop-blur-sm hover:border-white/60 hover:bg-white/10 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
                  aria-label="Next releases"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* ── Logo Loop ────────────────────────────────────────── */}
          <section className="py-16 border-b border-white/10 overflow-hidden logo-loop-section">
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Clubs & Promoters I've Worked With
            </p>
            <LogoLoop
              logos={[
                { src: "/logos/club_ecstasy.png", alt: "Club Ecstasy" },
                { src: "/logos/hakuna_matata.png", alt: "Hakuna Matata" },
                { src: "/logos/country_inn.png", alt: "Country Inn" },
                { src: "/logos/big_shot.png", alt: "Big Shot" },
                { src: "/logos/rage_media.png", alt: "Rage Media" },
                { src: "/logos/bux_studios.png", alt: "Bux Studios" },
                { src: "/logos/groovin.png", alt: "Groovin" },
                { src: "/logos/vibez.png", alt: "Vibez" },
                { src: "/logos/brewco.png", alt: "Brewco" },
                { src: "/logos/nc_productions.png", alt: "NC Productions" },
                { src: "/logos/dark_tribe.png", alt: "Dark Tribe" },
                { src: "/logos/tessaract_visuals.png", alt: "Tessaract Visuals" },
                { src: "/logos/afterhours_entertainment.png", alt: "Afterhours Entertainment" },
              ]}
              speed={60}
              pauseOnHover
              fadeOut
              fadeOutColor="#0b0b0b"
              logoHeight={120}
              gap={100}
            />
          </section>

          {/* ── Gradient transition into footer ──────────────────── */}
          <div className="h-40 bg-gradient-to-b from-background via-neutral-900 to-white" />

          {/* ── Contact / Footer ────────────────────────────────── */}
          <footer id="contact" className="relative py-16 md:py-32 px-6 md:px-16 bg-white text-black cursor-dark">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-4xl md:text-8xl font-bold tracking-tighter mb-8">
                    <WordReveal text="LET'S" className="block text-4xl md:text-8xl font-bold tracking-tighter" />
                    <WordReveal text="CONNECT" className="block text-4xl md:text-8xl font-bold tracking-tighter" delay={0.15} />
                  </h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-2xl font-light max-w-md mb-12"
                  >
                    Booking inquiries, promos, or just to say hello.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <a
                      href="https://mail.google.com/mail/?view=cm&to=ecliptix.official@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-20 inline-flex items-center gap-2 md:gap-3 text-base md:text-3xl font-mono hover:opacity-70 transition-opacity cursor-pointer break-all"
                    >
                      <Mail className="w-5 h-5 md:w-8 md:h-8 flex-shrink-0" />
                      ecliptix.official@gmail.com
                    </a>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-4"
                  >
                    <a
                      href="tel:+919449181617"
                      className="relative z-20 inline-flex items-center gap-2 md:gap-3 text-base md:text-3xl font-mono hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <Phone className="w-5 h-5 md:w-8 md:h-8 flex-shrink-0" />
                      +91 94491 81617
                    </a>
                  </motion.div>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                      <h3 className="font-bold uppercase tracking-wider text-sm">Socials</h3>
                      <ul className="space-y-2 text-lg">
                        {[
                          { name: "Instagram", href: "https://www.instagram.com/pritham.jpg/" },
                          { name: "YouTube", href: "https://www.youtube.com/@official.Ecliptix" },
                        ].map((social, i) => (
                          <motion.li
                            key={social.name}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                          >
                            <a href={social.href} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4 transition-all duration-200 hover:tracking-wide">
                              {social.name}
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-bold uppercase tracking-wider text-sm">Based In</h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-lg"
                      >
                        India
                      </motion.p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-black/10 pt-8">
                    <div className="w-32 h-8 text-black">
                      <EcliptixLogo className="text-black" />
                    </div>
                    <p className="text-xs font-mono">© 2026 ECLIPTIX. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </motion.main>
    </div>
  )
}
