export type DangerLevel = "SAFE" | "DANGER" | "CRITICAL";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  dangerLevel: DangerLevel;
  fatalChance: number; // in percentage, e.g., 5, 25, 50
  environment: string;
  advice: string;
}

export type GameStatus = "IDLE" | "PLAYING" | "FATAL" | "SURVIVED_ALL";

export interface RunHistoryItem {
  runId: bigint;
  player: string;
  score: number;
  roundsCompleted: number;
  timestamp: bigint;
  txHash?: string;
}
