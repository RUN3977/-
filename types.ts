export enum CircuitMode {
  ADD = 'ADD',
  SUB = 'SUB'
}

export interface CircuitState {
  uA: number;
  uB: number;
  mode: CircuitMode;
  uAdd: number;
  uSub: number;
  uY: number;
  carry: boolean;
  borrow: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
