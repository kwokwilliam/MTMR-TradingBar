import { CustomHandler } from "../handler";

export const testerCountShow: CustomHandler = (req, res, options) => {
	res.send(`${options.context.testCounter}`);
}

export const testerCountIncrement: CustomHandler = (req, res, options) => {
	options.context.testCounter++;
	res.send(" ");
}