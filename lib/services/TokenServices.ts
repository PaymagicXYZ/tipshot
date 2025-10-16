import 'server-only';
import { supabaseClient } from '../config/supabaseClient';

class TokenServices {
  async getTokens() {
    const { data, error } = await supabaseClient
      .from('token_toss_tokens')
      .select('*');

    if (error) throw error;

    return data;
  }

  async getTokenById({ id }: { id: number }) {
    const { data, error } = await supabaseClient
      .from('token_toss_tokens')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  }

  async getTokenByAddress({ address }: { address: string }) {
    const { data, error } = await supabaseClient
      .from('token_toss_tokens')
      .select('*')
      .eq('address', address)
      .single();

    if (error) throw error;

    return data;
  }
}

export const tokenServices = new TokenServices();
