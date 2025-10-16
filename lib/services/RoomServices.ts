import 'server-only';
import { supabaseClient } from '../config/supabaseClient';

class RoomServices {
  async createRoom() {
    const { data, error } = await supabaseClient
      .from('token_toss_rooms')
      .insert({})
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}

export const roomServices = new RoomServices();
