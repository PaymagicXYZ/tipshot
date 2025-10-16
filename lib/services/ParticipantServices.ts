// services/participantServices.ts
import 'server-only';
import { supabaseClient } from '../config/supabaseClient';

class ParticipantServices {
  async joinEvent({
    userId,
    eventId,
    type,
  }: {
    userId: number;
    eventId: number;
    type: 'sender' | 'receiver';
  }) {
    // Check if user already has a participant record in this event
    const { data: existing } = await supabaseClient
      .from('token_toss_participants')
      .select('*')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .eq('type', type)
      .maybeSingle();

    // If they were in the room before (rejoining), reactivate them
    if (existing) {
      const { data, error } = await supabaseClient
        .from('token_toss_participants')
        .update({
          status: 'active',
          joined_at: new Date().toISOString(),
          left_at: null,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    }

    // First time joining - create new record
    const { data, error } = await supabaseClient
      .from('token_toss_participants')
      .insert({
        user_id: userId,
        event_id: eventId,
        type,
        joined_at: new Date().toISOString(),
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async leaveEvent({ userId, eventId }: { userId: number; eventId: number }) {
    const { error } = await supabaseClient
      .from('token_toss_participants')
      .update({
        left_at: new Date().toISOString(),
        status: 'left',
      })
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .eq('status', 'active');

    if (error) throw error;
  }

  async updateHeartbeat({
    userId,
    eventId,
  }: {
    userId: number;
    eventId: number;
  }) {
    const { error } = await supabaseClient
      .from('token_toss_participants')
      .update({
        last_seen_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .eq('status', 'active');

    if (error) throw error;
  }

  async getActiveParticipants({ eventId }: { eventId: number }) {
    // Consider participants inactive if not seen in last 30 seconds
    // This accounts for ~6 missed heartbeats (5s interval)
    // Exception: receivers are always active (they're display screens/kiosks)
    const staleThreshold = new Date(Date.now() - 30000).toISOString();

    const { data, error } = await supabaseClient
      .from('token_toss_participants')
      .select(
        `
        *,
        user:token_toss_users(*)
      `,
      )
      .eq('event_id', eventId)
      .eq('status', 'active')
      //.or(`last_seen_at.gte.${staleThreshold},type.eq.receiver`) // Recent senders OR any receivers
      .order('joined_at', { ascending: true }); // Order by who joined first

    if (error) throw error;

    return data;
  }
}

export const participantServices = new ParticipantServices();
