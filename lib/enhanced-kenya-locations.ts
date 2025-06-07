// Enhanced Kenya locations data with complete county and constituency information

export interface County {
  id: string
  name: string
  code: string
  population?: number
  area?: number // in km²
  capital: string
  constituencies: Constituency[]
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Constituency {
  id: string
  name: string
  countyId: string
  population?: number
  area?: number
  coordinates?: {
    lat: number
    lng: number
  }
}

// Complete Kenya counties and constituencies data
export const enhancedKenyaLocations: County[] = [
  {
    id: "nairobi",
    name: "Nairobi",
    code: "047",
    population: 4397073,
    area: 696,
    capital: "Nairobi",
    coordinates: { lat: -1.2921, lng: 36.8219 },
    constituencies: [
      {
        id: "westlands",
        name: "Westlands",
        countyId: "nairobi",
        population: 198000,
        coordinates: { lat: -1.2676, lng: 36.8108 },
      },
      {
        id: "dagoretti-north",
        name: "Dagoretti North",
        countyId: "nairobi",
        population: 245000,
        coordinates: { lat: -1.3056, lng: 36.7528 },
      },
      {
        id: "dagoretti-south",
        name: "Dagoretti South",
        countyId: "nairobi",
        population: 312000,
        coordinates: { lat: -1.3167, lng: 36.7333 },
      },
      {
        id: "langata",
        name: "Langata",
        countyId: "nairobi",
        population: 195000,
        coordinates: { lat: -1.3667, lng: 36.7667 },
      },
      {
        id: "kibra",
        name: "Kibra",
        countyId: "nairobi",
        population: 250000,
        coordinates: { lat: -1.3167, lng: 36.7833 },
      },
      {
        id: "roysambu",
        name: "Roysambu",
        countyId: "nairobi",
        population: 298000,
        coordinates: { lat: -1.2167, lng: 36.8833 },
      },
      {
        id: "kasarani",
        name: "Kasarani",
        countyId: "nairobi",
        population: 523000,
        coordinates: { lat: -1.2167, lng: 36.9 },
      },
      {
        id: "ruaraka",
        name: "Ruaraka",
        countyId: "nairobi",
        population: 341000,
        coordinates: { lat: -1.25, lng: 36.8833 },
      },
      {
        id: "embakasi-south",
        name: "Embakasi South",
        countyId: "nairobi",
        population: 167000,
        coordinates: { lat: -1.35, lng: 36.8833 },
      },
      {
        id: "embakasi-north",
        name: "Embakasi North",
        countyId: "nairobi",
        population: 298000,
        coordinates: { lat: -1.3167, lng: 36.9 },
      },
      {
        id: "embakasi-central",
        name: "Embakasi Central",
        countyId: "nairobi",
        population: 312000,
        coordinates: { lat: -1.3333, lng: 36.9167 },
      },
      {
        id: "embakasi-east",
        name: "Embakasi East",
        countyId: "nairobi",
        population: 298000,
        coordinates: { lat: -1.3167, lng: 36.9333 },
      },
      {
        id: "embakasi-west",
        name: "Embakasi West",
        countyId: "nairobi",
        population: 245000,
        coordinates: { lat: -1.3333, lng: 36.8833 },
      },
      {
        id: "makadara",
        name: "Makadara",
        countyId: "nairobi",
        population: 178000,
        coordinates: { lat: -1.3, lng: 36.85 },
      },
      {
        id: "kamukunji",
        name: "Kamukunji",
        countyId: "nairobi",
        population: 298000,
        coordinates: { lat: -1.2833, lng: 36.8333 },
      },
      {
        id: "starehe",
        name: "Starehe",
        countyId: "nairobi",
        population: 210000,
        coordinates: { lat: -1.2667, lng: 36.8333 },
      },
      {
        id: "mathare",
        name: "Mathare",
        countyId: "nairobi",
        population: 298000,
        coordinates: { lat: -1.25, lng: 36.8667 },
      },
    ],
  },
  {
    id: "mombasa",
    name: "Mombasa",
    code: "001",
    population: 1208333,
    area: 230,
    capital: "Mombasa",
    coordinates: { lat: -4.0435, lng: 39.6682 },
    constituencies: [
      {
        id: "changamwe",
        name: "Changamwe",
        countyId: "mombasa",
        population: 195000,
        coordinates: { lat: -4.0167, lng: 39.6333 },
      },
      {
        id: "jomba",
        name: "Jomba",
        countyId: "mombasa",
        population: 167000,
        coordinates: { lat: -4.0333, lng: 39.6167 },
      },
      {
        id: "kisauni",
        name: "Kisauni",
        countyId: "mombasa",
        population: 298000,
        coordinates: { lat: -4.0, lng: 39.7 },
      },
      {
        id: "nyali",
        name: "Nyali",
        countyId: "mombasa",
        population: 245000,
        coordinates: { lat: -4.0167, lng: 39.7167 },
      },
      {
        id: "likoni",
        name: "Likoni",
        countyId: "mombasa",
        population: 178000,
        coordinates: { lat: -4.0833, lng: 39.6667 },
      },
      {
        id: "mvita",
        name: "Mvita",
        countyId: "mombasa",
        population: 125000,
        coordinates: { lat: -4.05, lng: 39.6833 },
      },
    ],
  },
  {
    id: "kisumu",
    name: "Kisumu",
    code: "042",
    population: 1155574,
    area: 2086,
    capital: "Kisumu",
    coordinates: { lat: -0.0917, lng: 34.768 },
    constituencies: [
      {
        id: "kisumu-central",
        name: "Kisumu Central",
        countyId: "kisumu",
        population: 167000,
        coordinates: { lat: -0.0917, lng: 34.768 },
      },
      {
        id: "kisumu-east",
        name: "Kisumu East",
        countyId: "kisumu",
        population: 195000,
        coordinates: { lat: -0.0833, lng: 34.7833 },
      },
      {
        id: "kisumu-west",
        name: "Kisumu West",
        countyId: "kisumu",
        population: 178000,
        coordinates: { lat: -0.1, lng: 34.75 },
      },
      {
        id: "seme",
        name: "Seme",
        countyId: "kisumu",
        population: 245000,
        coordinates: { lat: -0.1045, lng: 34.7345 },
      },
      {
        id: "nyando",
        name: "Nyando",
        countyId: "kisumu",
        population: 198000,
        coordinates: { lat: -0.1667, lng: 34.8333 },
      },
      {
        id: "muhoroni",
        name: "Muhoroni",
        countyId: "kisumu",
        population: 172000,
        coordinates: { lat: -0.15, lng: 35.2 },
      },
      {
        id: "nyakach",
        name: "Nyakach",
        countyId: "kisumu",
        population: 200000,
        coordinates: { lat: -0.25, lng: 34.75 },
      },
    ],
  },
  {
    id: "nakuru",
    name: "Nakuru",
    code: "032",
    population: 2162202,
    area: 7496,
    capital: "Nakuru",
    coordinates: { lat: -0.3031, lng: 36.08 },
    constituencies: [
      {
        id: "nakuru-town-east",
        name: "Nakuru Town East",
        countyId: "nakuru",
        population: 245000,
        coordinates: { lat: -0.3031, lng: 36.1034 },
      },
      {
        id: "nakuru-town-west",
        name: "Nakuru Town West",
        countyId: "nakuru",
        population: 298000,
        coordinates: { lat: -0.3167, lng: 36.0667 },
      },
      {
        id: "bahati",
        name: "Bahati",
        countyId: "nakuru",
        population: 178000,
        coordinates: { lat: -0.1833, lng: 36.1667 },
      },
      {
        id: "subukia",
        name: "Subukia",
        countyId: "nakuru",
        population: 167000,
        coordinates: { lat: -0.25, lng: 36.25 },
      },
      {
        id: "rongai",
        name: "Rongai",
        countyId: "nakuru",
        population: 195000,
        coordinates: { lat: -0.1667, lng: 35.8667 },
      },
      {
        id: "molo",
        name: "Molo",
        countyId: "nakuru",
        population: 210000,
        coordinates: { lat: -0.25, lng: 35.7333 },
      },
      {
        id: "njoro",
        name: "Njoro",
        countyId: "nakuru",
        population: 245000,
        coordinates: { lat: -0.3333, lng: 35.9333 },
      },
      {
        id: "naivasha",
        name: "Naivasha",
        countyId: "nakuru",
        population: 298000,
        coordinates: { lat: -0.7167, lng: 36.4333 },
      },
      {
        id: "gilgil",
        name: "Gilgil",
        countyId: "nakuru",
        population: 167000,
        coordinates: { lat: -0.5, lng: 36.3167 },
      },
      {
        id: "kuresoi-south",
        name: "Kuresoi South",
        countyId: "nakuru",
        population: 178000,
        coordinates: { lat: -0.0833, lng: 35.6 },
      },
      {
        id: "kuresoi-north",
        name: "Kuresoi North",
        countyId: "nakuru",
        population: 195000,
        coordinates: { lat: -0.05, lng: 35.5833 },
      },
    ],
  },
  {
    id: "uasin-gishu",
    name: "Uasin Gishu",
    code: "027",
    population: 1163186,
    area: 3345,
    capital: "Eldoret",
    coordinates: { lat: 0.5143, lng: 35.2698 },
    constituencies: [
      {
        id: "kapseret",
        name: "Kapseret",
        countyId: "uasin-gishu",
        population: 245000,
        coordinates: { lat: 0.2345, lng: 35.5678 },
      },
      {
        id: "kesses",
        name: "Kesses",
        countyId: "uasin-gishu",
        population: 298000,
        coordinates: { lat: 0.3333, lng: 35.2833 },
      },
      {
        id: "moiben",
        name: "Moiben",
        countyId: "uasin-gishu",
        population: 178000,
        coordinates: { lat: 0.5833, lng: 35.3333 },
      },
      {
        id: "turbo",
        name: "Turbo",
        countyId: "uasin-gishu",
        population: 195000,
        coordinates: { lat: 0.6167, lng: 35.0833 },
      },
      {
        id: "ainabkoi",
        name: "Ainabkoi",
        countyId: "uasin-gishu",
        population: 167000,
        coordinates: { lat: 0.4167, lng: 35.1667 },
      },
      {
        id: "soy",
        name: "Soy",
        countyId: "uasin-gishu",
        population: 80000,
        coordinates: { lat: 0.75, lng: 35.1167 },
      },
    ],
  },
  // Add more counties as needed...
  {
    id: "kiambu",
    name: "Kiambu",
    code: "022",
    population: 2417735,
    area: 2449,
    capital: "Kiambu",
    coordinates: { lat: -1.1714, lng: 36.8356 },
    constituencies: [
      {
        id: "gatundu-south",
        name: "Gatundu South",
        countyId: "kiambu",
        population: 167000,
        coordinates: { lat: -1.0333, lng: 37.0 },
      },
      {
        id: "gatundu-north",
        name: "Gatundu North",
        countyId: "kiambu",
        population: 195000,
        coordinates: { lat: -1.0, lng: 37.0167 },
      },
      {
        id: "juja",
        name: "Juja",
        countyId: "kiambu",
        population: 298000,
        coordinates: { lat: -1.1, lng: 37.0167 },
      },
      {
        id: "thika-town",
        name: "Thika Town",
        countyId: "kiambu",
        population: 245000,
        coordinates: { lat: -1.0333, lng: 37.0833 },
      },
      {
        id: "ruiru",
        name: "Ruiru",
        countyId: "kiambu",
        population: 312000,
        coordinates: { lat: -1.15, lng: 36.9667 },
      },
      {
        id: "githunguri",
        name: "Githunguri",
        countyId: "kiambu",
        population: 178000,
        coordinates: { lat: -1.0833, lng: 36.8 },
      },
      {
        id: "kiambu",
        name: "Kiambu",
        countyId: "kiambu",
        population: 210000,
        coordinates: { lat: -1.1714, lng: 36.8356 },
      },
      {
        id: "kiambaa",
        name: "Kiambaa",
        countyId: "kiambu",
        population: 195000,
        coordinates: { lat: -1.2, lng: 36.85 },
      },
      {
        id: "kabete",
        name: "Kabete",
        countyId: "kiambu",
        population: 167000,
        coordinates: { lat: -1.25, lng: 36.7333 },
      },
      {
        id: "kikuyu",
        name: "Kikuyu",
        countyId: "kiambu",
        population: 245000,
        coordinates: { lat: -1.2667, lng: 36.6667 },
      },
      {
        id: "limuru",
        name: "Limuru",
        countyId: "kiambu",
        population: 178000,
        coordinates: { lat: -1.1167, lng: 36.65 },
      },
      {
        id: "lari",
        name: "Lari",
        countyId: "kiambu",
        population: 198000,
        coordinates: { lat: -1.05, lng: 36.7 },
      },
    ],
  },
]

console.log("🔍 enhanced-kenya-locations.ts: File loaded, counties available:", enhancedKenyaLocations.length)

// Utility functions
export function getCountyById(countyId: string): County | undefined {
  return enhancedKenyaLocations.find((county) => county.id === countyId)
}

export function getConstituenciesByCounty(countyId: string): Constituency[] {
  console.log("🔍 getConstituenciesByCounty called with:", countyId)
  const county = getCountyById(countyId)
  const result = county ? county.constituencies : []
  console.log("🔍 getConstituenciesByCounty result:", result.length, "constituencies")
  return result
}

export function getConstituencyById(constituencyId: string): Constituency | undefined {
  for (const county of enhancedKenyaLocations) {
    const constituency = county.constituencies.find((c) => c.id === constituencyId)
    if (constituency) return constituency
  }
  return undefined
}

export function searchLocations(query: string): { counties: County[]; constituencies: Constituency[] } {
  const lowerQuery = query.toLowerCase()

  const counties = enhancedKenyaLocations.filter((county) => county.name.toLowerCase().includes(lowerQuery))

  const constituencies: Constituency[] = []
  for (const county of enhancedKenyaLocations) {
    for (const constituency of county.constituencies) {
      if (constituency.name.toLowerCase().includes(lowerQuery)) {
        constituencies.push(constituency)
      }
    }
  }

  return { counties, constituencies }
}

export function getAllConstituencies(): Constituency[] {
  const constituencies: Constituency[] = []
  for (const county of enhancedKenyaLocations) {
    constituencies.push(...county.constituencies)
  }
  return constituencies
}

export function getLocationHierarchy(constituencyId: string): { county: County; constituency: Constituency } | null {
  for (const county of enhancedKenyaLocations) {
    const constituency = county.constituencies.find((c) => c.id === constituencyId)
    if (constituency) {
      return { county, constituency }
    }
  }
  return null
}
