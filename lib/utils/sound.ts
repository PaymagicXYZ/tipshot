// Sound utilities (with Web Audio API)

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private initializationAttempted: boolean = false;

  // Lazy initialization - only create AudioContext when first sound is played
  private async ensureInitialized(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    // If already initialized and running, return true
    if (this.audioContext && this.audioContext.state === 'running') {
      return true;
    }

    // If we have a context but it's suspended, try to resume it
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        return this.audioContext.state !== 'suspended';
      } catch (e) {
        console.warn('Failed to resume AudioContext:', e);
        return false;
      }
    }

    // Create AudioContext on first use (during user interaction)
    if (!this.audioContext && !this.initializationAttempted) {
      try {
        this.initializationAttempted = true;
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        
        // Try to resume if suspended
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
        
        return this.audioContext.state === 'running';
      } catch (e) {
        console.warn('Web Audio API not supported or failed to initialize:', e);
        return false;
      }
    }

    return false;
  }

  // Kept for backward compatibility, but no longer creates AudioContext
  initialize(): void {
    // No-op - AudioContext will be created lazily on first sound play
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
  }

  // Simple tone generator for placeholder sounds
  private async playTone(frequency: number, duration: number, volume: number = 0.3): Promise<void> {
    if (!this.soundEnabled) return;

    // Initialize AudioContext lazily on first play (during user interaction)
    const isReady = await this.ensureInitialized();
    if (!isReady || !this.audioContext || !this.masterGain) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(volume, now);
      // Use exponentialRampToValueAtTime with a minimum value above 0 to avoid errors
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (e) {
      console.warn('Failed to play tone:', e);
    }
  }

  playFlick(): void {
    this.playTone(400, 0.1, 0.2);
  }

  playHit(): void {
    this.playTone(600, 0.15, 0.25);
  }

  playScore(): void {
    this.playTone(800, 0.2, 0.3);
    setTimeout(() => this.playTone(1000, 0.15, 0.25), 50);
  }

  playPowerUp(): void {
    this.playTone(300, 0.1, 0.2);
    setTimeout(() => this.playTone(500, 0.1, 0.25), 80);
    setTimeout(() => this.playTone(700, 0.15, 0.3), 160);
  }

  playGameOver(): void {
    this.playTone(600, 0.2, 0.3);
    setTimeout(() => this.playTone(500, 0.2, 0.3), 150);
    setTimeout(() => this.playTone(400, 0.3, 0.35), 300);
  }

  // Haptic feedback for mobile
  vibrate(pattern: number | number[]): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Vibration not supported
      }
    }
  }
}

export const soundManager = new SoundManager();