export enum Player {
	BLACK = "black",
	WHITE = "white",
}

export type Board = (Piece | undefined)[];

export enum Piece {
	WHITE = "w",
	BLACK = "b",
	WHITE_KING = "wk",
	BLACK_KING = "bk",
}

export enum Direction {
	NORTH_EAST = -3,
	NORTH_WEST = -4,
	SOUTH_WEST = 3,
	SOUTH_EAST = 4,
}

export type Move = {
	origin: number;
	destination: number;
	hit?: number;
};
