import { Emitter } from 'mitt';
import { REALTIME_EVENTS } from '@/lib/constants';
import {
  SIMULATION_CONFIG,
  SimulationConfig,
} from '@/lib/constants/simulationConfig';

// interface SimulatorConfig {
//   enabled: boolean;
//   intervalMs: number;
//   fakeParticipantCount: number;
// }

// const DEFAULT_CONFIG: SimulatorConfig = {
//   enabled: process.env.NEXT_PUBLIC_SIMULATION_ENABLED === 'true',
//   intervalMs: 25000, // 25 seconds
//   fakeParticipantCount: 3,
// };

// const FAKE_USERNAMES = ['Alex🚀', 'Sarah⭐', 'Mike🎯', 'Emma⚡', 'David🔥'];
// const FAKE_AVATARS = ['🚀', '⭐', '🎯', '⚡', '🔥', '💎', '🌟'];

export class ActivitySimulator {
  private intervalId: NodeJS.Timeout | null = null;
  private emitter: Emitter<any>;
  private eventId: number;
  private realParticipants: any[] = [];
  private config: SimulationConfig;
  private activeFakeParticipants: Map<string, any> = new Map();

  constructor(
    emitter: Emitter<any>,
    eventId: number,
    config?: Partial<SimulationConfig>,
  ) {
    this.emitter = emitter;
    this.eventId = eventId;
    this.config = { ...SIMULATION_CONFIG, ...config };

    if (this.config.enabled) {
      this.start();
    }
  }

  /**
   * Update with real participants from the event
   */
  updateParticipants(participants: any[]) {
    this.realParticipants = participants;
    // console.log('🔄 Simulator updated with participants:', participants.length);
  }

  // Add this method after the constructor
  /**
   * Initialize with fake participants from the start
   */
  private initializeWithFakeParticipants() {
    const initialCount = Math.min(
      this.config.participantCount,
      Math.floor(this.config.participantCount * 0.7), // Start with ~70% of max
    );

    // console.log('🎭 Initializing with', initialCount, 'fake participants');

    for (let i = 0; i < initialCount; i++) {
      const fakeParticipant = this.generateFakeSender();

      const participantEvent = {
        id: Math.floor(Math.random() * 10000),
        user_id: fakeParticipant.id,
        event_id: this.eventId,
        type: 'sender',
        status: 'active',
        joined_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        left_at: null,
        user: {
          id: fakeParticipant.id,
          username: fakeParticipant.username,
          pfp_url: null,
        },
        isFake: true,
      };

      this.activeFakeParticipants.set(fakeParticipant.id, participantEvent);

      // Emit event so ParticipantAvatars picks it up
      this.emitter.emit(REALTIME_EVENTS.PARTICIPANT_CHANGED, participantEvent);
    }
  }

  // Update the start() method to call this initialization
  private start() {
    if (this.intervalId) return;

    // console.log('🎬 Starting activity simulation for event:', this.eventId);

    // Initialize with fake participants immediately
    this.initializeWithFakeParticipants();

    this.intervalId = setInterval(() => {
      this.simulateActivity();
    }, this.config.baseIntervalMs);

    // Trigger first activity after 2 seconds
    setTimeout(() => this.simulateActivity(), 2000);
  }

  /**
   * Stop simulation
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.activeFakeParticipants.clear();
      // console.log('🛑 Stopped activity simulation for event:', this.eventId);
    }
  }

  /**
   * Main simulation logic
   */
  private simulateActivity() {
    if (!this.config.enabled) return;

    // 70% chance to simulate a tip, 30% chance for participant event
    if (Math.random() < 0.7) {
      this.simulateFakeTip();
    } else {
      this.simulateParticipantChange();
    }
  }

  /**
   * Simulate a fake tip: fake sender → real receiver
   */
  private simulateFakeTip() {
    // Find real receivers
    const receivers = this.realParticipants.filter(
      (p) => p.type === 'receiver',
    );

    if (receivers.length === 0) {
    //   console.log('⏸️ No receivers available for fake tip');
      return;
    }

    // Pick random receiver
    const receiver = receivers[Math.floor(Math.random() * receivers.length)];

    // Generate fake sender
    const fakeSender = this.generateFakeSender();

    // Create tip event
    const tipEvent = {
      id: `fake_tip_${Date.now()}`,
      sender_id: fakeSender.id,
      receiver_id: receiver.user_id,
      value: '0.01',
      formatted_value: '$0.01',
      formattedValue: '$0.01',
      created_at: new Date().toISOString(),
      event_id: this.eventId,
      // Extra fields for toast display
      senderUsername: fakeSender.username,
      receiverUsername: receiver.user?.username || 'Unknown',
      senderAvatar: fakeSender.avatar,
      receiverAvatar: receiver.user?.pfp_url || '',
      isFake: true, // Flag to identify fake events
    };

    // console.log(
    //   '💸 Simulated fake tip:',
    //   tipEvent.senderUsername,
    //   '→',
    //   tipEvent.receiverUsername,
    // );

    // Emit through mitt - existing listeners will handle toast
    this.emitter.emit(REALTIME_EVENTS.TIP_RECEIVED, tipEvent);
  }

  /**
   * Simulate participant join/leave
   */
  private simulateParticipantChange() {
    // Decide whether to join or leave
    const shouldJoin =
      this.activeFakeParticipants.size === 0 ||
      (this.activeFakeParticipants.size < this.config.participantCount &&
        Math.random() < 0.7);

    if (shouldJoin) {
      // Simulate join
      const fakeParticipant = this.generateFakeSender();

      const participantEvent = {
        id: Math.floor(Math.random() * 10000),
        user_id: fakeParticipant.id,
        event_id: this.eventId,
        type: 'sender',
        status: 'active',
        joined_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        left_at: null,
        user: {
          id: fakeParticipant.id,
          username: fakeParticipant.username,
          pfp_url: null,
        },
        isFake: true,
      };

      this.activeFakeParticipants.set(fakeParticipant.id, participantEvent);
      //   console.log('👋 Simulated participant join:', fakeParticipant.username);
      this.emitter.emit(REALTIME_EVENTS.PARTICIPANT_CHANGED, participantEvent);
    } else {
      // Simulate leave
      const participantIds = Array.from(this.activeFakeParticipants.keys());
      if (participantIds.length > 0) {
        const leaveId =
          participantIds[Math.floor(Math.random() * participantIds.length)];
        const participant = this.activeFakeParticipants.get(leaveId);

        const leaveEvent = {
          ...participant,
          status: 'inactive',
          left_at: new Date().toISOString(),
        };

        this.activeFakeParticipants.delete(leaveId);
        // console.log(
        //   '👋 Simulated participant leave:',
        //   participant.user.username,
        // );
        this.emitter.emit(REALTIME_EVENTS.PARTICIPANT_CHANGED, leaveEvent);
      }
    }
  }

  /**
   * Generate a fake sender participant
   */
  private generateFakeSender() {
    const username =
      this.config.usernames[
        Math.floor(Math.random() * this.config.usernames.length)
      ];
    const avatar =
      this.config.avatarEmojis[
        Math.floor(Math.random() * this.config.avatarEmojis.length)
      ];

    return {
      id: `fake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      avatar,
      type: 'sender' as const,
    };
  }

  /**
   * Get fake participants for display (senders only)
   */
  getFakeParticipants() {
    return Array.from(this.activeFakeParticipants.values());
  }
}
