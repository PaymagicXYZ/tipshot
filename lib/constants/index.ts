export const MINIAPP_FIDS = {
  FARCASTER: 9152,
  COINBASE_WALLET: 309857,
};

export enum SocialIdentifier {
  Farcaster = 'farcaster',
  TwitterOauth = 'twitter_oauth',
  Wallet = 'wallet',
  Gigbot = 'gigbot',
  Apple = 'apple_oauth',
}

// Real-time event names
export const REALTIME_EVENTS = {
  TIP_RECEIVED: 'tip:received',
  PARTICIPANT_CHANGED: 'participant:changed',
} as const;

// Tip configuration
export const TIP_CONFIG = {
  AMOUNT_WEI: '1', // 1 wei
  TOKEN_DECIMALS: 6,
  TOKEN_ID: 2, // USDC Hardcoded for now
} as const;
