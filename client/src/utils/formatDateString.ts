export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = date.getHours() % 12 || 12
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = date.getHours() < 12 ? '오전' : '오후'

  return `${year}.${month}.${day}. ${ampm} ${hours}:${minutes}`
}
