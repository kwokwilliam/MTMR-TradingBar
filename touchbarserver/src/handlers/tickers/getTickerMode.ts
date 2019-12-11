import { CustomHandler } from "../handler";
import chalk from 'chalk';
import { Mode } from "../../utils/mode";

export const getTickerMode: CustomHandler = (req, res, options) => {
	let displayMode: Mode;
	switch (options.context.mode) {
		case Mode.PERCENTAGE: {
			displayMode = Mode.PRICE;
			break;
		}
		case Mode.PRICE: {
			displayMode = Mode.FULL;
			break;
		}
		case Mode.FULL: {
			displayMode = Mode.PERCENTAGE;
			break;
		}
	}
	res.send(chalk.bgBlue(displayMode));
}