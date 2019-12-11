import { Request, Response } from "express";
import { SchemeForwardingOptions } from "../schemeForwarder";
import { CustomHandler } from "../handler";
import { TickerId, Ticker } from "../../context/ticker";
import { tickerFormatter } from "../../utils/tickerFormatter";
import { STOCK } from "../../constants/urls";

export const tickersGet: CustomHandler = (req: Request, res: Response, options: SchemeForwardingOptions) => {
	try {
		const tickerId: TickerId = req.params[STOCK];
		const ticker: Ticker = options.context.getTicker(tickerId);
		res.send(tickerFormatter(ticker, options.context));
	} catch (e) {
		res.send(e.message);
	}
}