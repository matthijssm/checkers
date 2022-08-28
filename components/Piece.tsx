import classNames from "classnames";
import React, { MouseEvent } from "react";
import { Piece as PieceEnum } from "../lib/BoardInterfaces";

type Props = {
	onClick: (event: MouseEvent) => void;
	selected?: boolean;
	color: PieceEnum;
};

export const Piece: React.FC<Props> = ({ onClick, color, selected }) => {
	return (
		<div
			onClick={onClick}
			className={classNames(
				"w-2/3 h-2/3 rounded-full cursor-pointer hover:shadow-xl transition-all",
				{
					"bg-white": color === PieceEnum.WHITE,
					"bg-black": color === PieceEnum.BLACK,
					"ring-4 ring-blue-400": selected,
				}
			)}
		></div>
	);
};
