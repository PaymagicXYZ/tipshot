'use server';

import { userServices } from '../services/UserServices';
import { TokenTossUser } from '../types';

export const upsertUser = async (
  userData: Omit<TokenTossUser, 'id' | 'created_at'>,
) => {
  return userServices.upsertUser(userData);
};

export const getUserByPrivyId = async ({
  privy_user_id,
}: {
  privy_user_id: string;
}) => {
  return userServices.getUserByPrivyId({ privy_user_id });
};

export const getUserById = async ({ userId }: { userId: number }) => {
  return userServices.getUserById({ userId });
};
