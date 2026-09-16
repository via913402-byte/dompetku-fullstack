export function formatRupiah(value) {
  const number = Number(value) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number)
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

export function formatMonthLabel(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date)
}
