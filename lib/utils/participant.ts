// Participant utility functions

// Heartbeat threshold constants
const STALE_THRESHOLD_MS = 60000; // 60 seconds (1 minute)

/**
 * Check if a participant is inactive based on their last_seen_at timestamp.
 * A participant is considered inactive if they haven't sent a heartbeat
 * in the last 60 seconds (1 minute).
 *
 * This is used to visually indicate which senders are no longer active
 * in the room (e.g., closed browser, lost connection, etc.)
 *
 * @param lastSeenAt - ISO timestamp string of when the participant was last seen
 * @returns true if the participant is inactive (last seen > 60s ago), false otherwise
 */
export function isParticipantInactive(lastSeenAt: string | null): boolean {
  // If last_seen_at is NULL, consider them active (they just joined)
  if (!lastSeenAt) {
    return false;
  }

  // IMPORTANT: Database returns timestamps without timezone suffix
  // Force parse as UTC by adding 'Z' if not present
  const timestamp =
    lastSeenAt.endsWith('Z') || lastSeenAt.includes('+')
      ? lastSeenAt
      : `${lastSeenAt}Z`;

  const lastSeen = new Date(timestamp).getTime();
  const now = Date.now();
  const timeSinceLastSeen = now - lastSeen;

  // Debug logging
  console.log('🔍 Checking participant inactivity:', {
    lastSeenAt,
    parsedTimestamp: timestamp,
    lastSeenMs: lastSeen,
    nowMs: now,
    diffMs: timeSinceLastSeen,
    diffSeconds: Math.floor(timeSinceLastSeen / 1000),
    threshold: STALE_THRESHOLD_MS,
    isInactive: timeSinceLastSeen > STALE_THRESHOLD_MS,
  });

  // Return true if more than 60 seconds (1 minute) have passed since last heartbeat
  return timeSinceLastSeen > STALE_THRESHOLD_MS;
}
