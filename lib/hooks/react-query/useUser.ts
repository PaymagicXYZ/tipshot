import { useMutation } from '@tanstack/react-query';
import { upsertUser } from '@/lib/actions/user';

export const useUpsertUser = () => {
  return useMutation({
    mutationFn: upsertUser,
    onSuccess: (data) => {
      console.log('✅ User synced successfully', data);
    },
    onError: (error) => {
      console.error('❌ Failed to sync user:', error);
    },
  });
};
