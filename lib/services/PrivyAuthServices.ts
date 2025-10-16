import 'server-only';
import { PrivyClient } from '@privy-io/node';
import { env } from '../config/env';

class PrivyAuthService {
  private client: PrivyClient;

  constructor() {
    this.client = new PrivyClient({
      appId: env.NEXT_PUBLIC_PRIVY_APP_ID,
      appSecret: env.PRIVY_APP_SECRET,
    });
  }

  async getUser({
    accessToken,
    identityToken,
  }: {
    accessToken: string;
    identityToken: string;
  }) {
    await this.client.utils().auth().verifyAuthToken(accessToken);
    return await this.client.utils().auth().verifyIdentityToken(identityToken);
  }
}

export const privyAuthService = new PrivyAuthService();
