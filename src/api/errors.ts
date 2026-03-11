import type { AxiosError } from 'axios'

/**
 * Builds a user-facing message from API or network error.
 */
export function getApiErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Unknown error.'
  const ax = err as AxiosError<{ error?: string }>
  const msg = ax.response?.data?.error
  if (typeof msg === 'string' && msg.trim()) return msg.trim()
  if (ax.response?.status === 400) return 'Invalid data.'
  if (ax.response?.status === 401) return 'Please log in.'
  if (ax.response?.status === 403) return 'Access denied.'
  if (ax.response?.status === 404) return 'Not found.'
  if (ax.response?.status === 409) return 'Conflict (e.g. email already in use).'
  if (ax.response?.status && ax.response.status >= 500) return 'Server error. Try again later.'
  if (ax.code === 'ERR_NETWORK' || ax.message === 'Network Error') {
    return 'Cannot reach server. Check your connection and that the server is running.'
  }
  if (ax.message && typeof ax.message === 'string') return ax.message
  return 'Something went wrong. Please try again.'
}
