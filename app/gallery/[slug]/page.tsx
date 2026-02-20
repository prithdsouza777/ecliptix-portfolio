import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { allEvents } from "@/lib/events"
import GalleryClient from "./gallery-client"

interface Props {
  params: Promise<{ slug: string }>
}

interface ImageKitFile {
  type: string
  name: string
  filePath: string
  url: string
  fileType: string
  width: number
  height: number
}

export interface GalleryItem {
  url: string
  width: number
  height: number
  type: "image" | "video"
}

async function fetchGalleryItems(folder: string): Promise<GalleryItem[]> {
  const key = process.env.IMAGEKIT_PRIVATE_KEY
  if (!key) return []

  try {
    const res = await fetch(
      `https://api.imagekit.io/v1/files?path=/${folder}&sort=ASC_NAME`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(key + ":").toString("base64")}`,
        },
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return []

    const files: ImageKitFile[] = await res.json()
    return files
      .filter((f) => f.type === "file" && (f.fileType === "image" || f.fileType === "non-image"))
      .filter((f) => /\.(jpg|jpeg|png|webp|mov|mp4)$/i.test(f.name))
      .map((f) => ({
        url: `https://ik.imagekit.io/ecliptix${f.filePath}`,
        width: f.width || 1920,
        height: f.height || 1080,
        type: /\.(mov|mp4)$/i.test(f.name) ? "video" as const : "image" as const,
      }))
  } catch {
    return []
  }
}

async function fetchCloudinaryVideos(folder: string): Promise<GalleryItem[]> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) return []

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey + ":" + apiSecret).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: `asset_folder="${folder}" AND resource_type:video`,
          max_results: 100,
          sort_by: [{ public_id: "asc" }],
        }),
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return []

    const data: { resources?: { secure_url: string; width?: number; height?: number }[] } = await res.json()
    return (data.resources || []).map((r) => ({
      url: r.secure_url.replace(/\.\w+$/, ".mp4"),
      width: r.width || 1080,
      height: r.height || 1920,
      type: "video" as const,
    }))
  } catch {
    return []
  }
}

export function generateStaticParams() {
  return allEvents.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = allEvents.find((e) => e.slug === slug)
  if (!event) return {}

  return {
    title: `${event.event} | ECLIPTIX Gallery`,
    description: `Photos from ${event.event} at ${event.venue}, ${event.city} — ${event.date}`,
  }
}

export default async function GalleryPage({ params }: Props) {
  const { slug } = await params
  const event = allEvents.find((e) => e.slug === slug)
  if (!event) notFound()

  const [imageKitItems, cloudinaryVideos] = await Promise.all([
    fetchGalleryItems(event.gallery.folder),
    fetchCloudinaryVideos(event.gallery.folder),
  ])

  // Interleave videos evenly among images so the gallery looks unified
  const images = imageKitItems.filter((i) => i.type === "image")
  const videos = [...imageKitItems.filter((i) => i.type === "video"), ...cloudinaryVideos]
  const items: GalleryItem[] = []
  const step = videos.length > 0 ? Math.max(1, Math.floor(images.length / (videos.length + 1))) : 0
  let vi = 0
  for (let i = 0; i < images.length; i++) {
    items.push(images[i])
    if (vi < videos.length && step > 0 && (i + 1) % step === 0) {
      items.push(videos[vi++])
    }
  }
  while (vi < videos.length) items.push(videos[vi++])

  return <GalleryClient event={event} items={items} />
}
