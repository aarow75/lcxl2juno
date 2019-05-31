const RANGE_FULL = [...Array(128).keys()];
const RANGE_4 = [...Array(4).keys()];
const RANGE_6 = [...Array(6).keys()];
const RANGE_ON_OFF = [...Array(2).keys()]; // on/off or toggle
const OCTAVE = ["oct -", "C#", "D#", "", "F#", "G#", "A#", "oct +", "C", "D", "E", "F", "G", "A", "B", "C"];

const VEL_OFF = 0;
const VEL_L_RED = 13;
const VEL_D_RED = 15;
const VEL_L_AMBER = 29;
const VEL_D_AMBER = 63;
const VEL_YELLOW = 62;
const VEL_L_GREEN = 28;
const VEL_D_GREEN = 60;

// set the knob colors
const BLACK = CHO = 0;
const RED = VCA = 10;
const YELLOW = VCF = 125;
const AMBER = DCO = 30;
const GREEN = LFO = 120;

const NOTE_MAP = {
  41: {
      note: ""
  },
  42: {
      note: "C#"
  },
  43: {
      note: "D#"
  },
  44: {
      note: ""
  },
  57: {
      note: "F#"
  },
  58: {
      note: "G#"
  },
  59: {
      note: "A#"
  },
  60: {
      note: ""
  },
  73: {
      note: "C"
  },
  74: {
      note: "D"
  },
  75: {
      note: "E"
  },
  76: {
      note: "F"
  },
  89: {
      note: "G"
  },
  90: {
      note: "A"
  },
  91: {
      note: "B"
  },
  92: {
      note: "C"
  },
  105: {
      note: ""
  },
};

/*
F0 [Exclusive]
41 [Roland ID#]
36 [Individual Tone Parameters]
0N [N=MIDI channel (N=0-F, Chan 1=00 Chan 16=0F)]
23 [Format type]
20 [unknown]
01 [unknown]
XX [Parameter number (0-23)] see table below
YY [Value (0-127)] Can be left at 00
F7 [End of Exclusive]
*/

const CC_MAP = {
  13: {
      name: 'LFO RATE',
      sysex: '18',
      desc: 'LFO Rate (0..7F)',
      type: 'lfo',
      range: RANGE_FULL
  },
  14: {
      name: 'LFO DELAY',
      sysex: '19',
      desc: 'LFO Delay (0..7F)',
      type: 'lfo',
      range: RANGE_FULL
  },
  15: {
      name: 'DCO RANGE',
      sysex: '06',
      desc: 'DCO Range (0=4\', 1=8\', 2=16\', 3=32\')',
      type: 'dco',
      range: RANGE_4
  },
  16: {
      name: 'DCO LFO',
      sysex: '0B',
      desc: 'DCO LFO Mod. (0..7F)',
      type: 'dco',
      range: RANGE_FULL
  },
  17: {
      name: 'DCO ENV',
      sysex: '0C',
      desc: 'DCO ENV Mod. (0..7F)',
      type: 'dco',
      range: RANGE_FULL
  },
  18: {
      name: 'DCO ENV MODE',
      sysex: '01',
      desc: 'DCO Env. Mode (0=Normal, 1=Inverted, 2=Normal-Dynamic, 3=Inv.-Dynamic)',
      type: 'dco',
      range: RANGE_4
  },
  19: {
      name: 'VCA LEVEL',
      sysex: '16',
      desc: 'VCA Level (0..7F)',
      type: 'vca',
      range: RANGE_FULL
  },
  20: {
      name: 'VCA ENV MODE',
      sysex: '02',
      desc: 'VCA Env. Mode (0=Normal, 1=Gate, 2=Normal-Dynamic, 3=Gate-Dynamic)',
      type: 'vca',
      range: RANGE_4
  },
  29: {
      name: 'PULSE',
      sysex: '03',
      desc: 'DCO Wave Pulse (0..3)',
      type: 'dco',
      range: RANGE_4
  },
  30: {
      name: 'SAW TOOTH',
      sysex: '04',
      desc: 'DCO Wave Saw (0..5)',
      type: 'dco',
      range: RANGE_6
  },
  31: {
      name: 'SUB',
      sysex: '05',
      desc: 'DCO Wave Sub (0..5)',
      type: 'dco',
      range: RANGE_6
  },
  32: {
      name: 'SUB LEVEL',
      sysex: '07',
      desc: 'DCO Sub Level (0..3)',
      type: 'dco',
      range: RANGE_4
  },
  33: {
      name: 'NOISE LEVEL',
      sysex: '08',
      desc: 'DCO Noise (0..3)',
      type: 'dco',
      range: RANGE_4
  },
  34: {
      name: 'PWM',
      sysex: '0E',
      desc: '	DCO PWM Depth (0..7F)',
      type: 'dco',
      range: RANGE_FULL
  },
  35: {
      name: 'PWM RATE',
      sysex: '0F',
      desc: 'DCO PWM Rate (0..7F) 0 = Pulse Width Manual 1..7F = PW LFO Rate',
      type: 'dco',
      range: RANGE_FULL
  },
  36: {
      name: 'CHORUS ON/OFF',
      sysex: '0A',
      desc: 'Chorus Switch (0=Off, 1=On)',
      type: 'cho',
      range: RANGE_ON_OFF
  },
  49: {
      name: 'HPF',
      sysex: '09',
      desc: 'HPF Cutoff (0..3)',
      type: 'vcf',
      range: RANGE_4
  },
  50: {
      name: 'FREQ',
      sysex: '10',
      desc: 'VCF Cutoff (0..7F)',
      type: 'vcf',
      range: RANGE_FULL
  },
  51: {
      name: 'RES',
      sysex: '11',
      desc: 'VCF Resonance (0..7F)',
      type: 'vcf',
      range: RANGE_FULL
  },
  52: {
      name: 'VCF LFO',
      sysex: '12',
      desc: 'VCF LFO Mod. (0..7F)',
      type: 'vcf',
      range: RANGE_FULL
  },
  53: {
      name: 'VCF ENV',
      sysex: '13',
      desc: 'VCF ENV Mod. (0..7F)',
      type: 'vcf',
      range: RANGE_FULL
  },
  54: {
      name: 'VCF ENV MODE',
      sysex: '01',
      desc: 'VCF Env. Mode (0=Normal, 1=Inverted, 2=Normal-Dynamic, 3=Dynamic)',
      type: 'vcf',
      range: RANGE_4
  },
  55: {
      name: 'VCF KEY FOLLOW',
      sysex: '14',
      desc: 'VCF Key Follow (0..7F)',
      type: 'vcf',
      range: RANGE_FULL
  },
  56: {
      name: 'CHORUS RATE',
      sysex: '22',
      desc: 'Chorus Rate (0..7F)',
      type: 'cho',
      range: RANGE_FULL
  },
  77: {
      name: 'ATTACK TIME',
      sysex: '1A',
      desc: 'ENV T1 (0..7F) Attack Time',
      type: 'env',
      range: RANGE_FULL
  },
  78: {
      name: 'ATTACK LEVEL',
      sysex: '1B',
      desc: 'ENV L1 (0..7F) Attack Level',
      type: 'env',
      range: RANGE_FULL
  },
  79: {
      name: 'BREAK TIME',
      sysex: '1C',
      desc: 'ENV T2 (0..7F) Break Time',
      type: 'env',
      range: RANGE_FULL
  },
  80: {
      name: 'BREAK LEVEL',
      sysex: '1D',
      desc: 'ENV L2 (0..7F) Break Level',
      type: 'env',
      range: RANGE_FULL
  },
  81: {
      name: 'DECAY',
      sysex: '1E',
      desc: 'ENV T3 (0..7F) Decay Time',
      type: 'env',
      range: RANGE_FULL
  },
  82: {
      name: 'SUSTAIN',
      sysex: '1F',
      desc: 'ENV L3 (0..7F) Sustain Level',
      type: 'env',
      range: RANGE_FULL
  },
  83: {
      name: 'RELEASE',
      sysex: '20',
      desc: 'ENV T4 (0..7F) Release Time',
      type: 'env',
      range: RANGE_FULL
  },
  84: {
      name: 'KEY FOLLOW',
      sysex: '21',
      desc: 'ENV Key Follow (0..7F)',
      type: 'env',
      range: RANGE_FULL
  },
  97: {
      name: 'DCO Aftertouch',
      sysex: '0D',
      desc: 'DOC After Mod. (0..7F)',
      type: 'dco',
      range: RANGE_FULL
  },
  98: {
      name: 'VCF Aftertouch',
      sysex: '15',
      desc: 'VCF Aftertouch (0..7F)',
      type: 'vcf',
      range: RANGE_FULL
  },
  99: {
      name: 'VCA Aftertouch',
      sysex: '17',
      desc: 'VCA Aftertouch (0..7F)',
      type: 'vca',
      range: RANGE_FULL
  }
};