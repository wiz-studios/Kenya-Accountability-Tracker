// Lightweight wrapper that exposes complete Kenya location data (all 47 counties + constituencies)
// while keeping the helper API that the UI relies on.

import {
  completeKenyaData,
  type County,
  type Constituency,
  getCountyById as getCountyByIdRaw,
  getConstituenciesByCounty as getConstituenciesByCountyRaw,
  getConstituencyById as getConstituencyByIdRaw,
} from "./complete-kenya-data"

export type { County, Constituency } from "./complete-kenya-data"

// Main exported dataset consumed across the app.
export const enhancedKenyaLocations = completeKenyaData

export function getCountyById(countyId: string) {
  return getCountyByIdRaw(countyId) ?? completeKenyaData.find((county) => county.code === countyId)
}

export function getConstituenciesByCounty(countyId: string) {
  return getConstituenciesByCountyRaw(countyId)
}

export function getConstituencyById(constituencyId: string) {
  return getConstituencyByIdRaw(constituencyId)
}

export function getAllConstituencies() {
  return completeKenyaData.flatMap((county) => county.constituencies)
}

export function searchLocations(query: string): { counties: County[]; constituencies: Constituency[] } {
  const normalized = query.trim().toLowerCase()

  const counties =
    normalized.length === 0
      ? [...completeKenyaData]
      : completeKenyaData.filter(
          (county) =>
            county.name.toLowerCase().includes(normalized) ||
            county.capital.toLowerCase().includes(normalized) ||
            county.code.toLowerCase().includes(normalized),
        )

  const constituencies =
    normalized.length === 0
      ? []
      : getAllConstituencies().filter((constituency) => constituency.name.toLowerCase().includes(normalized))

  return { counties, constituencies }
}

export function getLocationHierarchy(constituencyId: string): { county: County; constituency: Constituency } | null {
  const constituency = getConstituencyById(constituencyId)
  if (!constituency) return null

  const county = getCountyById(constituency.countyId)
  if (!county) return null

  return { county, constituency }
}

// Keep a light log so we can verify the full dataset is wired up during dev.
console.log("enhanced-kenya-locations: loaded counties", enhancedKenyaLocations.length)

