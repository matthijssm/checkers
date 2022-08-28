import { Board, Direction, Move, Piece, Player } from "./BoardInterfaces";
import { PieceInfo } from "./GameState";

const getAllowedDirections = (piece: Piece, index: number) => {
	const directions: Direction[] = [];

	const isEastEdgePiece = index % 8 === 7;
	const isWestEdgePiece = index % 8 === 0;

	const isKing = piece === Piece.WHITE_KING || piece === Piece.BLACK_KING;

	if (piece === Piece.WHITE || isKing) {
		if (!isEastEdgePiece) {
			directions.push(Direction.NORTH_EAST);
		}
		if (!isWestEdgePiece) {
			directions.push(Direction.NORTH_WEST);
		}
	}

	if (piece === Piece.BLACK || isKing) {
		if (!isEastEdgePiece) {
			directions.push(Direction.SOUTH_EAST);
		}
		if (!isWestEdgePiece) {
			directions.push(Direction.SOUTH_WEST);
		}
	}

	return directions;
};

export const isOpponent = (piece: Piece, otherPiece: Piece) => {
	return (
		((piece === Piece.WHITE || piece === Piece.WHITE_KING) &&
			(otherPiece === Piece.BLACK || otherPiece === Piece.BLACK_KING)) ||
		((piece === Piece.BLACK || piece === Piece.BLACK_KING) &&
			(otherPiece === Piece.WHITE || otherPiece === Piece.WHITE_KING))
	);
};

const getNextTile = (index: number, direction: Direction) => {
	const row = (index - (index % 4)) / 4;
	const isEvenRow = row % 2 === 1;

	const isEastEdgePiece = index % 8 === 7;
	const isWestEdgePiece = index % 8 === 0;

	switch (direction) {
		case Direction.SOUTH_EAST:
			if (isEastEdgePiece) {
				return;
			}
			return isEvenRow ? index + 5 : index + 4;
		case Direction.SOUTH_WEST:
			if (isWestEdgePiece) {
				return;
			}
			return isEvenRow ? index + 4 : index + 3;
		case Direction.NORTH_EAST:
			if (isEastEdgePiece) {
				return;
			}
			return isEvenRow ? index - 3 : index - 4;
		case Direction.NORTH_WEST:
			if (isWestEdgePiece) {
				return;
			}
			return isEvenRow ? index - 4 : index - 5;
	}
};

export const getAllowedPositions = (
	index: number,
	directions: Direction[],
	board: Board,
	piece: Piece
): Move[] => {
	const possibleMoves = directions.reduce((positions, direction) => {
		let step = 0;
		let nextPosition: number = getNextTile(index, direction)!;
		let hit = undefined;

		while (nextPosition >= 0 && nextPosition < 32) {
			const tile = board[nextPosition];

			// The next tile is empty
			if (tile === undefined) {
				positions.push({
					origin: index,
					destination: nextPosition,
					hit,
				});
				break;
			}

			// The next tile is an opponent
			if (isOpponent(piece, tile)) {
				if (step === 0) {
					hit = nextPosition;
					const nextIndex = getNextTile(nextPosition, direction);
					if (!nextIndex) {
						break;
					}
					nextPosition = nextIndex;
					step++;
				} else {
					break;
				}
			}

			// The next tile is the same color
			if (!isOpponent(piece, tile)) {
				break;
			}
		}

		return positions;
	}, [] as Move[]);

	const obligedMoves = possibleMoves.filter((move) => move.hit !== undefined);

	return obligedMoves.length > 0 ? obligedMoves : possibleMoves;
};

export const getPieceInfo = (
	index: number,
	board: Board
): PieceInfo | undefined => {
	const piece = board[index];

	if (!piece) {
		return undefined;
	}

	const allowedDirections = getAllowedDirections(piece, index);
	const allowedPositions = getAllowedPositions(
		index,
		allowedDirections,
		board,
		piece
	);

	return {
		position: index,
		color: piece,
		allowedDirection: allowedDirections,
		allowedMoves: allowedPositions,
	};
};

export const isPlayersPiece = (piece: Piece, activePlayer: Player) => {
	if (activePlayer === Player.WHITE) {
		return piece === Piece.WHITE || piece === Piece.WHITE_KING;
	}

	if (activePlayer === Player.BLACK) {
		return piece === Piece.BLACK || piece === Piece.BLACK_KING;
	}

	return false;
};
