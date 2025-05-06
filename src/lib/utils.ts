export const formatDateRange = (startDateStr: string, endDateStr: string) => {
  const start = new Date(startDateStr)
  const end = new Date(endDateStr)
  const now = new Date()
  const currentYear = now.getFullYear()

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  }

  const formatOptionsWithYear: Intl.DateTimeFormatOptions = {
    ...formatOptions,
    year: 'numeric'
  }

  const formatSingleDate = (date: Date) => {
    const year = date.getFullYear()
    const options = year === currentYear ? formatOptions : formatOptionsWithYear
    return new Intl.DateTimeFormat(undefined, options).format(date)
  }

  if (start.toDateString() === end.toDateString()) {
    return formatSingleDate(start)
  } else {
    return `${formatSingleDate(start)} - ${formatSingleDate(end)}`
  }
}
