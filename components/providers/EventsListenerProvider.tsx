'use client';

import { useParticipantChangeListener } from '@/lib/hooks/react-query/useParticipant';
import { useTipReceivedListener } from '@/lib/hooks/react-query/useTip';
import { useState, createContext, useContext, useMemo } from 'react';
import mitt, { type Emitter } from 'mitt';
import { REALTIME_EVENTS } from '@/lib/constants';
import { Nullable } from '@/lib/types';
import { useInit } from '@/lib/hooks/useInit';
import { useActivitySimulator } from '@/lib/hooks/useActivitySimulator';

// Event types map
type Events = {
  [REALTIME_EVENTS.TIP_RECEIVED]: any;
  [REALTIME_EVENTS.PARTICIPANT_CHANGED]: any;
  [key: string]: any;
};

// Context type
interface EventsListenerContextType {
  setEventId: (id: Nullable<number>) => void;
  emitter: Emitter<Events>;
}

// Create context
const EventsListenerContext = createContext<EventsListenerContextType | null>(
  null,
);

// Hook to use the context
export const useEventsListener = () => {
  const context = useContext(EventsListenerContext);
  if (!context) {
    throw new Error(
      'useEventsListener must be used within EventListenerRegistry',
    );
  }
  return context;
};

// Internal component that sets up listeners
const EventListenerRegistry = ({ eventId }: { eventId: Nullable<number> }) => {
  // Set up real-time listeners
  useTipReceivedListener({ eventId });
  useParticipantChangeListener({ eventId });

  // Set up activity simulation
  useActivitySimulator(eventId);

  return null;
};

// Provider component
export const EventsListenerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useInit();
  const [eventId, setEventId] = useState<Nullable<number>>(null);
  const emitter = useMemo(() => mitt<Events>(), []);

  return (
    <EventsListenerContext.Provider value={{ setEventId, emitter }}>
      <EventListenerRegistry eventId={eventId} />
      {children}
    </EventsListenerContext.Provider>
  );
};
