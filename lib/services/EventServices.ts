import 'server-only';
import { supabaseClient } from '../config/supabaseClient';
import { after } from 'next/server';
import { privyWalletServices } from './PrivyWalletServices';
import { roomServices } from './RoomServices';
import { participantServices } from './ParticipantServices';

class EventServices {
  async createEvent({
    name,
    recipientIds,
  }: {
    name: string;
    recipientIds: number[];
  }) {
    const room = await roomServices.createRoom();

    const { data, error } = await supabaseClient
      .from('token_toss_events')
      .insert({
        name,
        room_id: room.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Add all recipients to the event
    const recipients = await Promise.all(
      recipientIds.map((userId) =>
        participantServices.joinEvent({
          userId,
          eventId: data.id,
          type: 'receiver',
        }),
      ),
    );

    after(async () => {
      try {
        await privyWalletServices.createSmartAccount({
          eventId: data.id,
        });
      } catch (error) {
        console.error(
          'Failed to create smart account for event:',
          data.id,
          error,
        );
      }
    });

    return { event: data, recipients };
  }

  async getEvents() {
    const { data, error } = await supabaseClient
      .from('token_toss_events')
      .select('*');

    if (error) throw error;

    return data;
  }

  async getEventById({ id }: { id: number }) {
    const { data, error } = await supabaseClient
      .from('token_toss_events')
      .select(
        `
        *,
        wallets:token_toss_wallets!event_id(privy_id, address)
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;

    // Extract the first wallet (each event has only one wallet)
    const wallet = data.wallets?.[0] || null;

    return {
      ...data,
      wallet,
    };
  }
}

export const eventServices = new EventServices();
