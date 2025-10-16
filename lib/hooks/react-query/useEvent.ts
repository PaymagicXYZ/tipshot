import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEvent, getEventById, getEvents } from '@/lib/actions/event';
import { toast } from 'sonner';

// Query Keys
export const eventKeys = {
  all: ['events'] as const,
  detail: (id: number) => [...eventKeys.all, 'detail', id] as const,
};

// Queries
export const useEventById = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => getEventById({ id }),
    enabled: !!id,
  });
};

export const useEvents = () => {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: getEvents,
  });
};

// Mutations
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success('Event created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create event');
    },
  });
};
