import { CustomHandler } from "../handler";

export const newsFetch: CustomHandler = (req, res, options) => {
	options.context.fetchNews();
	res.send(' ');
}

export const newsFetchGeneral: CustomHandler = (req, res, options) => {
	options.context.fetchNews(true);
	res.send(' ');
}