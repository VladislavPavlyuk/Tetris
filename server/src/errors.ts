/**
 * Converts an error into a user-facing message.
 * Does not expose internal details (DB strings, etc.) in production.
 */
export function toUserMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code
    if (code === 'ER_ACCESS_DENIED_ERROR' || code === 'ECONNREFUSED') {
      return 'Database connection failed. Check server configuration.'
    }
    if (code === 'ER_BAD_DB_ERROR') {
      return 'Database not found. Create the database and try again.'
    }
    if (code === 'ER_DUP_ENTRY') {
      return 'This email is already registered.'
    }
    if (code === 'ER_NO_REFERENCED_ROW_2' || code === 'ER_NO_REFERENCED_ROW') {
      return 'Data integrity error.'
    }
  }
  if (err instanceof Error) {
    if (err.message.includes('jwt') || err.message.includes('token')) {
      return 'Invalid or expired session. Please log in again.'
    }
  }
  return 'Internal server error. Please try again later.'
}
