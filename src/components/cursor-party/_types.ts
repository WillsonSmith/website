export type Position = {
  x: number;
  y: number;
  timestamp: number;
};

export default undefined;
export type Cursor = {
  color: string;
  position: Position;
  history: Position[];
  state: 'cursor' | 'high-five';
};
