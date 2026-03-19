export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

/**
 * Format a Firestore Timestamp (or any object with `.toDate()`) into a
 * relative time string.  Falls back to 'just now' when the timestamp is null
 * or doesn't have a `.toDate()` method.
 */
export function formatTimestamp(timestamp: any): string {
    if (!timestamp?.toDate) return 'just now';
    return formatRelativeTime(timestamp.toDate());
}
