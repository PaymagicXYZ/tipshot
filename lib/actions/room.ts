'use server';

import { roomServices } from '../services/RoomServices';

export const createRoom = async () => {
  return roomServices.createRoom();
};
