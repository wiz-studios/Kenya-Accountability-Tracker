export type MemorialLeaderEntry = {
  name: string
  memorialDate?: string | null
  message: string
  photoUrl?: string | null
  keyProjects?: string[]
  recentActions?: string[]
  allegations?: number
  accountabilityScore?: number
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
    memorialDate: "2026-02-28",
    message: "In respectful memory of his public service and contribution to his constituency.",
    photoUrl: "https://parliament.go.ke/sites/default/files/2022-09/Ngeno%20Stephen%20Johana%20Kipyegon.jpg",
    keyProjects: [
      "Rollout and resumption support for major road upgrades in Emurua Dikirr (100km per ward target announced with county leadership).",
      "Handover of 7 school buses to learning institutions in Emurua Dikirr.",
      "NG-CDF bursary disbursement of KSh 46M to support school reopening.",
    ],
    recentActions: [
      "Advocated for local-priority allocation in the Affordable Housing Programme.",
      "Participated in constituency emergency response and community support missions before his passing.",
    ],
    allegations: 0,
    accountabilityScore: 70,
    sourceUrl: "https://apnews.com/article/e60122a117d00d2c3b63b223ad125e7e",
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
