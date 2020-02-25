import { CustomHandler } from "../handler";
import { tickerFormatter } from "../../utils/tickerFormatter";
import { Ticker } from "../../context/ticker";

export const getTickerActiveStock: CustomHandler = (req, res, options) => {
	try {
		const tickerId = options.context.activeStock;
		if (!tickerId) {
			throw new Error("Unable to find ticker");
		}
		const ticker: Ticker = options.context.getTicker(tickerId);
		res.send(tickerFormatter(ticker, options.context));
	} catch (e) {
		res.send(e.message);
	}
}