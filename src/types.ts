export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface VoiceConfig {
  voiceURI: string;
  pitch: number;
  rate: number;
  muted: boolean;
}

export type OrniState = 'initial' | 'transitioning' | 'evolved';
