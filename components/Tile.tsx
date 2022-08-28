import classNames from "classnames";
import React, { MouseEvent } from "react";

type Props = {
	position: number;
	isAllowed: boolean;
	onClick: (event: MouseEvent) => void;
	children?: React.ReactNode;
};

export const Tile: React.FC<Props> = ({
	position,
	onClick,
	isAllowed,
	children,
}) => {
	const row = (position - (position % 4)) / 4 + 1;
	const isAlternated = row % 2 === 0;
	return (
		<div
			className={classNames("flex", {
				"flex-row-reverse": isAlternated,
			})}
		>
			<div
				onClick={onClick}
				className={classNames(
					"flex-1 bg-emerald-800 flex items-center justify-center relative",
					{
						"ring-sky-600 ring-2 box-border cursor-pointer":
							isAllowed,
					}
				)}
			>
				<p className="absolute top-1 left-1 text-xs text-emerald-600">
					{position}
				</p>
				{children}
			</div>
			{/* Empty column for board */}
			<div className="flex-1 bg-emerald-100"></div>
		</div>
	);
};
