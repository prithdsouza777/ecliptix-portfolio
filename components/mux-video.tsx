"use client"

import MuxPlayer from "@mux/mux-player-react"

interface MuxVideoProps {
  playbackId: string
  title: string
  className?: string
}

export default function MuxVideo({ playbackId, title, className = "" }: MuxVideoProps) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title }}
      streamType="on-demand"
      accentColor="#FFFFFF"
      className={className}
      style={{ aspectRatio: "9/16", width: "100%" } as React.CSSProperties}
      thumbnailTime={0}
    />
  )
}
