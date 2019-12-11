import { CustomHandler } from "../handler";
import path from 'path';

export const configHtml: CustomHandler = (req, res, options) => {
	res.sendFile(path.resolve(options.context.configHtmlLocation));
}