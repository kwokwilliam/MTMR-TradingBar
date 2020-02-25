import { CustomHandler } from "../handler";

export const fetchStart: CustomHandler = (req, res, options) => {
	options.context.startFetching();
	res.send(` `);
}

export const fetchStop: CustomHandler = (req, res, options) => {
	options.context.stopFetching();
	res.send(` `);
}