# Heartbeat Implementation Summary

## Problem Solved

Users who close/refresh their browser were staying in the "active participants" list indefinitely because the `unmount` cleanup is unreliable for page unload events.

## Solution

Implemented a **heartbeat-based presence system** that automatically detects and removes inactive participants.

---

## Architecture

### Two-Layer Presence Detection

1. **Explicit Status (`status` column)**

   - User clicks "Leave Room" → immediately set to `'left'`
   - Provides instant feedback

2. **Liveness Check (`last_seen_at` column)**
   - Updated every 5 seconds by client heartbeat
   - Participants with stale timestamps (>30s old) are filtered out
   - Catches crashed/disconnected/closed browser scenarios

---

## Implementation Details

### Client-Side

- **Hook**: `useParticipantHeartbeat` sends heartbeat every 5 seconds
- **Fallback**: Uses `sendBeacon` API on page unload (best-effort)
- **Optimization**: Sends heartbeat when tab becomes visible again

### Server-Side

- **Service**: `ParticipantServices.updateHeartbeat()` updates timestamp
- **Query**: `getActiveParticipants()` filters by both `status='active'` AND `last_seen_at >= 30s ago`
- **API Route**: `/api/participant/leave` for sendBeacon requests

### Database

- **Column**: `last_seen_at TIMESTAMP NOT NULL`
- **Index**: Composite index on `(room_id, status, last_seen_at)` for performance
- **Default**: Set to `NOW()` on insert

## Next Steps

### 1. Run Database Migration

Execute the SQL in `supabase-migration-add-last-seen-at.sql` in your Supabase SQL editor.

### 2. Test Scenarios

- ✅ Normal leave (explicit)
- ✅ Page refresh (rejoin)
- ✅ Browser close (auto-cleanup within 30s)
- ✅ Connection lost (auto-cleanup within 30s)

### 3. Monitor

- Check browser console for heartbeat logs: `💓 Starting heartbeat...`
- Verify `last_seen_at` updates in database every 5 seconds
- Watch for any errors in `/api/participant/leave` endpoint

---

## Configuration

### Tuning Parameters

```typescript
// lib/hooks/useParticipantHeartbeat.ts
HEARTBEAT_INTERVAL = 10000; // 10 seconds

// lib/services/ParticipantServices.ts
staleThreshold = Date.now() - 30000; // 30 seconds (6x heartbeat interval)
```

**Rule of thumb**: Keep `staleThreshold` at 6x the `HEARTBEAT_INTERVAL` to allow for network delays.

---

## Benefits

✅ **Reliable**: Works even when browser crashes or network drops  
✅ **Automatic**: No manual intervention needed  
✅ **Performant**: Indexed queries, efficient updates  
✅ **Scalable**: Standard pattern used by Slack, Discord, etc.  
✅ **Debuggable**: Clear console logs and timestamps

---

## Limitations

⚠️ **30-second delay**: Users see inactive participants for up to 30 seconds  
⚠️ **Network overhead**: 1 request every 5 seconds per active user  
⚠️ **Battery impact**: Minimal but present on mobile devices

These are acceptable trade-offs for a real-time presence system.
