'use server';

import { eventServices } from '../services/EventServices';

export const createEvent = async ({
  name,
  recipientIds,
}: {
  name: string;
  recipientIds: number[];
}) => {
  return eventServices.createEvent({
    name,
    recipientIds,
  });
};

export const getEvents = async () => {
  return eventServices.getEvents();
};

export const getEventById = async ({ id }: { id: number }) => {
  return eventServices.getEventById({ id });
};
