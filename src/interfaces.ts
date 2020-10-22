export type Players = 'X' | 'O';

export interface HistoryEntry {
	squares: Array<Players | null>;
	round: number;
	turn: Players;
}

export interface SquareProps {
	value: Players | null;
	onClick(): void;
}

export interface BoardProps {
	handleClick(i: number): void;
	currentBoard: HistoryEntry;
}

export interface GameState {
	history: Array<HistoryEntry>;
	currentRound: number;
}
