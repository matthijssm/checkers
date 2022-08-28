import { observer } from "mobx-react";
import type { NextPage } from "next";
import Head from "next/head";
import { GameState } from "../lib/GameState";
import { Piece } from "../lib/BoardInterfaces";
import { MouseEvent } from "react";
import { Tile } from "../components/Tile";
import { Piece as PieceComponent } from "../components/Piece";

const state = new GameState();

const Home: NextPage = observer(() => {
	const onClickPiece =
		(index: number, piece: Piece) => (event: MouseEvent) => {
			event.stopPropagation();
			state.selectPiece(index, piece);
		};

	const onClickTile = (index: number) => (event: MouseEvent) => {
		event.stopPropagation();
		if (
			!state.selectedPiece?.allowedMoves.some(
				(move) => move.destination === index
			)
		) {
			console.log("Cannot move to this tile!");
			return;
		}

		state.movePiece(index);
	};

	return (
		<div>
			<Head>
				<title>Checkers</title>
				<meta name="description" content="Awesome checkers board" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="container flex flex-col gap-4">
					<div className="flex gap-4">
						<p className="">Active player: {state.activeTurn}</p>
						<p className="">
							Forced to move:{" "}
							{!!state.obligedMoves.length ? "Yes" : "No"}
						</p>
						<p className="">Total moves: {state.history.length}</p>
					</div>
					<div className="grid grid-cols-4 grid-rows-8 w-[800px] h-[800px] border-8 border-black">
						{state.board.map((piece, index) => {
							const isAllowed =
								state.selectedPiece?.allowedMoves.some(
									(move) => move.destination === index
								) || false;

							return (
								<Tile
									onClick={onClickTile(index)}
									isAllowed={isAllowed}
									position={index}
									key={`board_tile_${index}`}
								>
									{!!piece && (
										<PieceComponent
											color={piece}
											onClick={onClickPiece(index, piece)}
											selected={
												state.selectedPiece
													?.position === index
											}
										/>
									)}
								</Tile>
							);
						})}
					</div>
				</div>
			</main>
		</div>
	);
});

export default Home;
