/**
 * Date formatting utilities for consistent date display across the application
 */

export const dateFormats = {
  short: { month: 'short', year: 'numeric' } as Intl.DateTimeFormatOptions,
  full: { month: 'short', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
  long: { month: 'long', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
  time: { hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions,
  datetime: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  } as Intl.DateTimeFormatOptions,
}

/**
 * Format a date string or Date object with consistent formatting
 * @param date - Date string or Date object to format
 * @param format - Format key from dateFormats (default: 'full')
 * @param locale - Locale to use (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: keyof typeof dateFormats = 'full',
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, dateFormats[format])
}

/**
 * Format a date as relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
  } else if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

/**
 * Check if a date is in the past
 * @param date - Date string or Date object
 * @returns True if date is in the past
 */
export function isDatePast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.getTime() < Date.now()
}

/**
 * Check if a date is in the future
 * @param date - Date string or Date object
 * @returns True if date is in the future
 */
export function isDateFuture(date: Date | string): boolean {
  return !isDatePast(date)
}

/**
 * Get the difference between two dates in days
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in days
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  const date1Obj = typeof date1 === 'string' ? new Date(date1) : date1
  const date2Obj = typeof date2 === 'string' ? new Date(date2) : date2
  const diffInMs = date2Obj.getTime() - date1Obj.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}
