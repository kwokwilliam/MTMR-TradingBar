import { CustomHandler } from "../handler";

export const getConfig: CustomHandler = (req, res, options) => {
	res.json(options.context.getConfig());
}