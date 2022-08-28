import { makeAutoObservable } from "mobx";
import { Board, Direction, Move, Piece, Player } from "./BoardInterfaces";
import {
	getAllowedPositions,
	getPieceInfo,
	isPlayersPiece,
} from "./GameHelpers";

export type PieceInfo = {
	position: number;
	color: Piece;
	allowedDirection: Direction[];
	allowedMoves: Move[];
};

export class GameState {
	constructor() {
		makeAutoObservable(this);
	}

	public board: Board = new Array(32)
		.fill(Piece.BLACK, 0, 12)
		.fill(Piece.WHITE, 20, 32) as Board;
	public history: Board[] = [];
	public activeTurn: Player = Player.WHITE;

	public selectedPiece?: PieceInfo = undefined;
	public selectPiece = (index: number, piece: Piece) => {
		if (!isPlayersPiece(piece, this.activeTurn)) {
			console.log("It is not your turn!");
			return;
		}

		if (
			!!this.obligedMoves.length &&
			!this.obligedMoves.some((move) => move.origin === index)
		) {
			console.log(
				"You can't move this piece because you have an other piece to move."
			);
			return;
		}

		const info = getPieceInfo(index, this.board);
		if (!!info) {
			this.selectedPiece = info;
		}

		console.log(info);
	};

	public movePiece = (newPosition: number) => {
		if (!this.selectedPiece) {
			return;
		}

		const move = this.selectedPiece.allowedMoves.find(
			(move) => move.destination === newPosition
		);
		if (!move) {
			return;
		}

		this.history.push(this.board);

		this.board.splice(this.selectedPiece.position, 1, undefined);
		this.board[move.destination] = this.selectedPiece.color;

		if (move.hit !== undefined) {
			this.board.splice(move.hit, 1, undefined);

			// Check if the moved piece can hit another piece
			if (
				!!this.obligedMoves.length &&
				this.obligedMoves.some(
					(obligedMove) => obligedMove.origin === move.destination
				)
			) {
				this.selectPiece(
					move.destination,
					this.board[move.destination]!
				);
				return;
			}
		}

		this.switchActiveTurn();
		this.selectedPiece = undefined;
	};

	private switchActiveTurn = () => {
		this.activeTurn =
			this.activeTurn === Player.WHITE ? Player.BLACK : Player.WHITE;
	};

	public get obligedMoves(): Move[] {
		return this.board.reduce((moves, piece, index) => {
			if (!piece) {
				return moves;
			}

			if (!isPlayersPiece(piece, this.activeTurn)) {
				return moves;
			}

			const pieceInfo = getPieceInfo(index, this.board);
			if (!pieceInfo) {
				return moves;
			}

			moves.push(
				...pieceInfo.allowedMoves.filter(
					(move) => move.hit !== undefined
				)
			);

			return moves;
		}, [] as Move[]);
	}
}
