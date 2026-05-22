import { OpponentBatsman, OpponentBowler } from '../types';

export const PRELOADED_BATSMEN: OpponentBatsman[] = [
  {
    id: 'bat-1',
    name: 'Marcus Smith',
    battingHand: 'Left-Hand',
    weaknessTypes: ['Corridor of Uncertainty', 'Left-Arm Angles', 'Outswinging Deliveries'],
    vulnerableShots: ['Cover Drive on the rise', 'Lofted Off-Drive'],
    pitchMapWeakness: 'good-outside-off',
    tacticalFieldSetup: 'slip-cordon',
    notes: 'Struggles immensely early in the innings when the ball is moving. Tends to reach for wide balls without moving his feet, resulting in outside edges. Bowl full in the corridor to tempt him into driving, then slant one across.',
    stats: {
      matches: 24,
      average: 41.2,
      strikeRate: 135.4
    }
  },
  {
    id: 'bat-2',
    name: 'Karan Sharma',
    battingHand: 'Right-Hand',
    weaknessTypes: ['Short-Ball Ribline', 'In-Swinging Yorkers', 'High Bounce'],
    vulnerableShots: ['Horizontal Hook/Pull', 'Flappy Cut Shot'],
    pitchMapWeakness: 'short-body',
    tacticalFieldSetup: 'shortline-choke',
    notes: 'Very aggressive against short balls but has poor control. Plays active pull shots but frequently top-edges. Plan: Target his throat/shoulders from over-the-wicket, choke the body line, and place deep fielders on the leg side boundary.',
    stats: {
      matches: 38,
      average: 29.8,
      strikeRate: 148.2
    }
  },
  {
    id: 'bat-3',
    name: 'Brad Finch',
    battingHand: 'Right-Hand',
    weaknessTypes: ['Googly / Wrong-un', 'Arm-ball Drift', 'Slower Cutters'],
    vulnerableShots: ['Sweep Shot', 'Front-foot Forward Defense'],
    pitchMapWeakness: 'good-stumps',
    tacticalFieldSetup: 'spin-ring',
    notes: 'Cannot pick the leg-spinner\'s googly out of the hand. Commits early to forward defense, leaving a massive gap between bat and pad. Bowl full and turning back into the stumps to trap him LBW or bowl him clean.',
    stats: {
      matches: 15,
      average: 22.4,
      strikeRate: 112.1
    }
  }
];

export const PRELOADED_BOWLERS: OpponentBowler[] = [
  {
    id: 'bowl-1',
    name: 'Shaheen Khan',
    bowlingStyle: 'Left-Arm Fast',
    weaknessTypes: ['Struggles round-the-wicket', 'Predictable Yorker Lengths', 'Erratic under early attack'],
    targetShots: ['Step-out Lofted Drive', 'Flick off pads', 'Slog Sweep'],
    pitchMapLeak: 'half-volley-pads',
    antiBowlerStrategy: 'charge-down',
    notes: 'Relies heavily on late inswing with the new ball. If batsman charges him or steps out of crease early in the over, his lengths drag short and he loses swing control. Struggles to get wickets when bowling round-the-wicket.',
    stats: {
      matches: 32,
      economy: 7.85,
      strikeRate: 16.4
    }
  },
  {
    id: 'bowl-2',
    name: 'Rashid Ahmed',
    bowlingStyle: 'Right-Arm Leg-Spin',
    weaknessTypes: ['Struggles against clean sweeps', 'Struggles with wet ball', 'Aggressive counter-attack'],
    targetShots: ['Deep Square Sweep', 'Reverse Sweep', 'Late Cut'],
    pitchMapLeak: 'good-stumps',
    antiBowlerStrategy: 'sweep-and-scurry',
    notes: 'Bowls a very flat, high-speed trajectory in the stumps. Conventional driving is risky due to quick turn/googly. Best countered by sweeps and reverse sweeps to breach his field; sweeps force him to adjust lengths and pitch shorter.',
    stats: {
      matches: 45,
      economy: 6.20,
      strikeRate: 18.2
    }
  },
  {
    id: 'bowl-3',
    name: 'Lockie Wood',
    bowlingStyle: 'Right-Arm Fast',
    weaknessTypes: ['Leaks high full-tosses under pressure', 'Loses length discipline in death overs', 'Bad lines on wet pitch'],
    targetShots: ['Behind wicket Scoop', 'Third-man Ramp', 'Deep Cover Slash'],
    pitchMapLeak: 'full-toss-full',
    antiBowlerStrategy: 'death-fringe',
    notes: 'Relies heavily on raw pace and yorkers in final overs. Stand deep inside the batting crease to convert his yorkers into full tosses or half-volleys. Utilize ramps, scoops, and cuts to exploit fine-leg / third-man gaps when he misses his length.',
    stats: {
      matches: 28,
      economy: 9.45,
      strikeRate: 20.8
    }
  }
];
