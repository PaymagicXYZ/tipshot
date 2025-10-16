'use server';

import { tokenServices } from '../services/TokenServices';

export const getTokens = async () => {
  return tokenServices.getTokens();
};

export const getTokenById = async ({ id }: { id: number }) => {
  return tokenServices.getTokenById({ id });
};

export const getTokenByAddress = async ({ address }: { address: string }) => {
  return tokenServices.getTokenByAddress({ address });
};
