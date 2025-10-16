import 'server-only';
import { supabaseClient } from '../config/supabaseClient';
import { privyAuthService } from './PrivyAuthServices';
import { userServices } from './UserServices';

class TipServices {
  async sendTip({
    eventId,
    senderId,
    receiverId,
    value,
    formattedValue,
    tokenId,
  }: {
    eventId: number;
    senderId: number;
    receiverId: number;
    value: string;
    formattedValue: string;
    tokenId: number;
  }) {
    const { data, error } = await supabaseClient
      .from('token_toss_tips')
      .insert({
        event_id: eventId,
        sender_id: senderId,
        receiver_id: receiverId,
        value,
        formatted_value: formattedValue,
        token_id: tokenId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTipsByEvent({ eventId }: { eventId: number }) {
    const { data, error } = await supabaseClient
      .from('token_toss_tips')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getTipsByReceiver({
    receiverId,
    eventId,
  }: {
    receiverId: number;
    eventId?: number;
  }) {
    let query = supabaseClient
      .from('token_toss_tips')
      .select(
        `
        *,
        token:token_toss_tokens(symbol, is_native, address, decimals)
      `,
      )
      .eq('receiver_id', receiverId)
      .eq('status', 'pending');

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;
    return data;
  }

  async getLeaderboard({
    limit = 20,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  } = {}) {
    const { data, error } = await supabaseClient.rpc(
      'token_toss_get_tips_leaderboard' as any,
      { page_limit: limit, page_offset: offset } as any,
    );
    if (error) throw error;
    return data;
  }

  async getPendingClaims({
    accessToken,
    identityToken,
  }: {
    accessToken: string;
    identityToken: string;
  }) {
    // Verify auth tokens and get Privy user data
    const privyAuth = await privyAuthService.getUser({
      accessToken,
      identityToken,
    });

    if (!privyAuth.id) {
      throw new Error('Invalid authentication: No user ID found');
    }

    // Get our internal user ID from Privy user ID
    const { data: user } = await userServices.getUserByPrivyId({
      privy_user_id: privyAuth.id,
    });

    if (!user) {
      throw new Error('User not found in database');
    }

    // Fetch tips for this user
    const data = await this.getTipsByReceiver({ receiverId: user.id });
    return data;
  }

  async getRecentTips({ limit = 20 }: { limit?: number } = {}) {
    const { data, error } = await supabaseClient
      .from('token_toss_activity')
      .select(
        `
        tip_id,
        created_at,
        formatted_value,
        sender_id,
        sender_username,
        sender_pfp_url,
        receiver_id,
        receiver_username,
        receiver_pfp_url
        `,
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((row) => ({
      id: row.tip_id,
      created_at: row.created_at,
      formatted_value: row.formatted_value,
      sender: {
        id: row.sender_id,
        username: row.sender_username,
        pfp_url: row.sender_pfp_url,
      },
      receiver: {
        id: row.receiver_id,
        username: row.receiver_username,
        pfp_url: row.receiver_pfp_url,
      },
    }));
  }

  async updateTipsWithBundleId({
    tipIds,
    bundleId,
    status = 'success',
  }: {
    tipIds: number[];
    bundleId: string;
    status?: 'pending' | 'success' | 'failed' | 'processing' | 'expired';
  }) {
    const { data, error } = await supabaseClient
      .from('token_toss_tips')
      .update({
        bundle_id: bundleId,
        status: status,
      })
      .in('id', tipIds)
      .select();

    if (error) throw error;
    return data;
  }
}

export const tipServices = new TipServices();
