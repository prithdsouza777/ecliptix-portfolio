"use client"

import dynamic from "next/dynamic"

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => (
    <div
      style={{ aspectRatio: "9/16", width: "100%", background: "rgba(255,255,255,0.05)" }}
    />
  ),
})

interface MuxVideoProps {
  playbackId: string
  title: string
  className?: string
  thumbnailTime?: number
}

export default function MuxVideo({ playbackId, title, className = "", thumbnailTime = 0 }: MuxVideoProps) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title }}
      streamType="on-demand"
      accentColor="#FFFFFF"
      className={className}
      style={{ aspectRatio: "9/16", width: "100%" } as React.CSSProperties}
      thumbnailTime={thumbnailTime}
    />
  )
}
