const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const formatDate = (isoDate: string): string => {
  if (!isoDate) return "Unknown"
  const [year, month, day] = isoDate.split("-")
  if (!year || !month || !day) return isoDate
  const monthIndex = Number(month) - 1
  const monthName = MONTHS[monthIndex] || month
  return `${day} ${monthName} ${year}`
}

export const formatDateTime = (isoDateTime: string): string => {
  if (!isoDateTime) return "Unknown"
  const [datePart, timePart] = isoDateTime.split("T")
  const dateLabel = formatDate(datePart || isoDateTime)
  if (!timePart) return dateLabel
  const trimmed = timePart.replace("Z", "")
  const timeLabel = trimmed.slice(0, 5)
  return timeLabel ? `${dateLabel} ${timeLabel}` : dateLabel
}

export const formatYear = (isoDate: string): string => {
  if (!isoDate) return "Unknown"
  const [year] = isoDate.split("-")
  return year || isoDate
}

export const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "0"
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
