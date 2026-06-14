/**
 * formatChatTimestamp
 * Formats a Firestore-style { seconds, nanoseconds } timestamp for the chat list.
 * - < 1 min  → "now"
 * - < 60 min → "2 min ago"
 * - < 24 hr  → "1 hr ago"
 * - same week → "Mon", "Tue", …
 * - older    → "12 Jan", "3 Mar 2023", …
 */
export const formatChatTimestamp = (timestamp) => {
    if (!timestamp?.seconds) return ''

    const ms = timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1e6
    const now = Date.now()
    const diff = now - ms

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return 'now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hr ago`

    const date = new Date(ms)
    const nowDate = new Date(now)

    // Same calendar week (Sun–Sat)
    const startOfWeek = new Date(nowDate)
    startOfWeek.setDate(nowDate.getDate() - nowDate.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    if (date >= startOfWeek) {
        return date.toLocaleDateString('en-US', { weekday: 'short' }) // "Mon"
    }

    // Same year
    if (date.getFullYear() === nowDate.getFullYear()) {
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) // "12 Jan"
    }

    // Older
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) // "3 Mar 2023"
}