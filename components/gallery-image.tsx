"use client"

import { CldImage } from "next-cloudinary"

interface GalleryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function GalleryImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
}: GalleryImageProps) {
  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
      format="auto"
      quality="auto"
    />
  )
}
