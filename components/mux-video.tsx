"use client"

import MuxPlayer from "@mux/mux-player-react"

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
