export type BattingHand = 'Right-Hand' | 'Left-Hand';

export type BowlingStyle = 
  | 'Right-Arm Fast' 
  | 'Right-Arm Off-Spin' 
  | 'Right-Arm Leg-Spin' 
  | 'Left-Arm Fast' 
  | 'Left-Arm Orthodox' 
  | 'Left-Arm Wrist-Spin';

export interface Fielder {
  name: string;
  x: number; // 0 to 200 coordinate space
  y: number; // 0 to 200 coordinate space
}

export interface PlayerStats {
  matches: number;
  average?: number; // for batsman
  strikeRate: number;
  economy?: number; // for bowler
}

export interface OpponentBatsman {
  id: string;
  name: string;
  battingHand: BattingHand;
  weaknessTypes: string[]; // e.g., 'Short Ball', 'Outside Off Corridor'
  vulnerableShots: string[]; // e.g., 'Cover Drive', 'Pull Shot'
  pitchMapWeakness: string; // e.g., 'short-body', 'good-outside-off'
  tacticalFieldSetup: string; // e.g., 'shortline-choke', 'slip-cordon'
  customFielders?: Fielder[]; // manual custom fielding alignments
  notes: string;
  stats: PlayerStats;
  customAdded?: boolean;
}

export interface OpponentBowler {
  id: string;
  name: string;
  bowlingStyle: BowlingStyle;
  weaknessTypes: string[]; // e.g., 'Struggles with wet ball', 'Leaks under pressure'
  targetShots: string[]; // e.g., 'Sweep & Scoop', 'Step out & Loft'
  pitchMapLeak: string; // e.g., 'half-volley-pads', 'short-wide'
  antiBowlerStrategy: string; // e.g., 'sweep-spin', 'attack-early'
  notes: string;
  stats: PlayerStats;
  customAdded?: boolean;
}
