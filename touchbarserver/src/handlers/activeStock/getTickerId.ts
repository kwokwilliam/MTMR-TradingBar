import { CustomHandler } from "../handler";
import chalk from "chalk";

export const getTickerId: CustomHandler = (req, res, options) => {
	const ticker = options.context.activeStock || " "
	res.send(chalk.bgBlue(ticker));
}