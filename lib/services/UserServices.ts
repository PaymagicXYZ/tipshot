import 'server-only';
import { supabaseClient } from '../config/supabaseClient';
import { TokenTossUser } from '../types/';

class UserServices {
  async upsertUser(userData: Omit<TokenTossUser, 'id' | 'created_at'>) {
    // First, try to get existing user
    const { data: existingUser } = await this.getUserByPrivyId({
      privy_user_id: userData.privy_user_id,
    });

    if (existingUser) {
      // User exists, update them
      const { data, error } = await supabaseClient
        .from('token_toss_users')
        .update({
          username: userData.username,
          pfp_url: userData.pfp_url,
          farcaster_id: userData.farcaster_id,
          farcaster_username: userData.farcaster_username,
          farcaster_metadata: userData.farcaster_metadata,
          x_id: userData.x_id,
          x_username: userData.x_username,
          x_metadata: userData.x_metadata,
          privy_metadata: userData.privy_metadata,
        })
        .eq('privy_user_id', userData.privy_user_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // User doesn't exist, insert them
      const { data, error } = await supabaseClient
        .from('token_toss_users')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async getUserByPrivyId({ privy_user_id }: { privy_user_id: string }) {
    const { data, error } = await supabaseClient
      .from('token_toss_users')
      .select()
      .eq('privy_user_id', privy_user_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      console.error(
        `[UsersService] ❌ Error fetching user with privy_user_id ${privy_user_id}:`,
        error,
      );
    }

    return { data, error };
  }

  async getUserById({ userId }: { userId: number }) {
    const { data, error } = await supabaseClient
      .from('token_toss_users')
      .select('id, username, pfp_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error(
        `[UsersService] ❌ Error fetching user with id ${userId}:`,
        error,
      );
      throw error;
    }

    return data;
  }
}

export const userServices = new UserServices();
