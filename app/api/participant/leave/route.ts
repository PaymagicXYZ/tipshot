import { NextRequest, NextResponse } from 'next/server';
import { leaveEvent } from '@/lib/actions/participant';

/**
 * API endpoint for sendBeacon on page unload
 * This is a best-effort attempt to mark users as left when they close/refresh the page
 * The heartbeat timeout mechanism will catch it if this fails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, eventId } = body;

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: 'Missing userId or eventId' },
        { status: 400 },
      );
    }

    await leaveEvent({ userId, eventId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in leave room API:', error);
    // Return 200 even on error since this is best-effort
    return NextResponse.json({ success: false });
  }
}
