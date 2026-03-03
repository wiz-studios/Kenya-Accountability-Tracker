export type MemorialLeaderEntry = {
  name: string
  memorialDate?: string | null
  message: string
  sourceUrl?: string | null
}

const normalizeLeaderName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")

const memorialEntries: MemorialLeaderEntry[] = [
  {
    name: "Johana Ng'eno Kipyegon",
    memorialDate: null,
    message: "In respectful memory of his public service and contribution to his constituency.",
    sourceUrl: null,
  },
]

export const memorialLeaderMap = new Map(
  memorialEntries.map((entry) => [
    normalizeLeaderName(entry.name),
    {
      ...entry,
    },
  ]),
)

export const getMemorialLeaderByName = (name: string) => memorialLeaderMap.get(normalizeLeaderName(name))

