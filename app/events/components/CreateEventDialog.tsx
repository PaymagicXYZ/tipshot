'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateEvent } from '@/lib/hooks/react-query/useEvent';
import { PlusIcon } from 'lucide-react';

export const CreateEventDialog = () => {
  const [eventName, setEventName] = useState('');
  const [open, setOpen] = useState(false);
  const createEvent = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName.trim()) return;

    try {
      // Create event (room creation and participant joining handled in the action)
      await createEvent.mutateAsync({
        name: eventName.trim(),
        recipientIds: [2], // Hardcoded recipient user ID
      });

      // Reset form and close dialog
      setEventName('');
      setOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <PlusIcon className="size-5" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Give your event a name. A room will be created automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input
                id="event-name"
                placeholder="e.g., Team Celebration"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                disabled={createEvent.isPending}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createEvent.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createEvent.isPending || !eventName.trim()}
            >
              {createEvent.isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
