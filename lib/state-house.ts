export type StateHouseRecord = {
  title: string
  amountMillions: number
  date: string
  issue: string
  status: string
  risk: number
  reference?: string
  source?: string
}

export const stateHouseExpenditures: StateHouseRecord[] = [
  {
    title: "Petty cash withdrawals without approvals",
    amountMillions: 214,
    date: "2025-04-12",
    issue: "Unauthorized withdrawals flagged by audit teams",
    status: "Under investigation",
    risk: 86,
    reference: "https://oagkenya.go.ke/reports",
    source: "Office of the Auditor-General (National Government Audit)",
  },
  {
    title: "Protocol events with missing vouchers",
    amountMillions: 96,
    date: "2025-02-28",
    issue: "Unsupported expenditures and missing receipts",
    status: "Unexplained",
    risk: 74,
    reference: "https://cob.go.ke/downloads",
    source: "Controller of Budget (Quarterly Budget Implementation Review)",
  },
  {
    title: "Fuel and fleet overbilling",
    amountMillions: 58,
    date: "2025-03-15",
    issue: "Inflated invoices versus GPS logs",
    status: "At risk",
    risk: 62,
    reference: "https://ppoa.go.ke/resources",
    source: "Public Procurement Regulatory Authority spot-check",
  },
  {
    title: "Security equipment double payments",
    amountMillions: 131,
    date: "2025-01-30",
    issue: "Duplicate supplier billing",
    status: "Escalated",
    risk: 80,
    reference: "https://oagkenya.go.ke/special-reports",
    source: "OAG Special Audit (State House Security Vote)",
  },
]
