import { useEvents } from './react-query/useEvent';
import { usePendingClaims } from './react-query/useTip';

export const useInit = () => {
  useEvents();
  usePendingClaims();
};
