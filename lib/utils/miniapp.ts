import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Open a URL in the miniapp
 * @param url - The full URL to open (must be absolute URL with http:// or https://)
 */
export const openUrl = async (url: string): Promise<void> => {
  try {
    await sdk.actions.openUrl(url);
  } catch (error) {
    console.error('Failed to open URL in miniapp:', error);
    throw error;
  }
};
