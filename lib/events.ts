export interface EventData {
  date: string
  city: string
  venue: string
  event: string
  slug: string
  gallery: {
    folder: string
    images: string[]
  }
}

export const allEvents: EventData[] = [
  {
    date: "FEB 14 '26",
    city: "Manipal",
    venue: "Big Shot",
    event: "Sweet Secret — Valentine's Day",
    slug: "sweet-secret-valentines-day",
    gallery: {
      folder: "sweet-secret-valentines-day",
      images: ["IMG_001.jpg"],
    },
  },
  {
    date: "JAN 24 '26",
    city: "Manipal",
    venue: "Big Shot",
    event: "Pink City",
    slug: "pink-city",
    gallery: {
      folder: "pink-city",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "JAN 18 '26",
    city: "Manipal",
    venue: "Big Shot",
    event: "Sin City — Vol. II",
    slug: "sin-city-vol-ii",
    gallery: {
      folder: "sin-city-vol-ii",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "JAN 11 '26",
    city: "Manipal",
    venue: "Big Shot",
    event: "Blackout Affair",
    slug: "blackout-affair",
    gallery: {
      folder: "blackout-affair",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "DEC 31 '25",
    city: "Manipal",
    venue: "Ecstasy",
    event: "New Year's Eve",
    slug: "new-years-eve",
    gallery: {
      folder: "new-years-eve",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "NOV 29 '25",
    city: "Manipal",
    venue: "Hakuna Matata",
    event: "One Last Dance",
    slug: "one-last-dance",
    gallery: {
      folder: "one-last-dance",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "NOV 16 '25",
    city: "Mangalore",
    venue: "SJEC",
    event: "Hostel Day '25",
    slug: "hostel-day-25",
    gallery: {
      folder: "hostel-day-25",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "NOV 13 '25",
    city: "Manipal",
    venue: "SJEC",
    event: "Tiara '25",
    slug: "tiara-25-nov",
    gallery: {
      folder: "tiara-25-nov",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "OCT 10 '25",
    city: "Manipal",
    venue: "Ecstasy",
    event: "Badtameez Night",
    slug: "badtameez-night",
    gallery: {
      folder: "badtameez-night",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "SEP 19 '25",
    city: "Manipal",
    venue: "Ecstasy",
    event: "Raat Ka Rivaz",
    slug: "raat-ka-rivaz",
    gallery: {
      folder: "raat-ka-rivaz",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "AUG 08 '25",
    city: "Manipal",
    venue: "Hakuna Matata",
    event: "The Spotlight",
    slug: "the-spotlight",
    gallery: {
      folder: "the-spotlight",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "MAY 31 '25",
    city: "Mangalore",
    venue: "SJEC",
    event: "Alvida '25",
    slug: "alvida-25",
    gallery: {
      folder: "alvida-25",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "MAY 23 '25",
    city: "Mangalore",
    venue: "SJEC",
    event: "CSE Farewell",
    slug: "cse-farewell",
    gallery: {
      folder: "cse-farewell",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "MAR 20 '25",
    city: "Mangalore",
    venue: "SJEC",
    event: "Tiara '25",
    slug: "tiara-25-mar",
    gallery: {
      folder: "tiara-25-mar",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "MAR 11 '25",
    city: "Mangalore",
    venue: "SJEC",
    event: "Sports Day '25",
    slug: "sports-day-25",
    gallery: {
      folder: "sports-day-25",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "NOV 22 '24",
    city: "Mangalore",
    venue: "SJEC",
    event: "ECE Branch Entry",
    slug: "ece-branch-entry",
    gallery: {
      folder: "ece-branch-entry",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "NOV 20 '24",
    city: "Mangalore",
    venue: "SJEC",
    event: "Milan",
    slug: "milan",
    gallery: {
      folder: "milan",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "OCT 26 '24",
    city: "Mangalore",
    venue: "SJEC",
    event: "Freshers Day '24",
    slug: "freshers-day-24",
    gallery: {
      folder: "freshers-day-24",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
  {
    date: "MAY 09 '24",
    city: "Mangalore",
    venue: "SJEC",
    event: "Tiara '24",
    slug: "tiara-24",
    gallery: {
      folder: "tiara-24",
      images: ["IMG_001.jpg", "IMG_002.jpg", "IMG_003.jpg", "IMG_004.jpg", "IMG_005.jpg", "IMG_006.jpg"],
    },
  },
]
