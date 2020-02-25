import { News } from "../utils/news";
import { YahooFinanceData, YahooFinanceResponse, parseYahooFinanceResponse } from "../utils/yahoofinancedata";
import fetch from 'node-fetch';
import { YAHOO_FINANCE_QUOTE } from "../constants/urls";

export class Ticker {
	private news: News = [];
	private stockData?: YahooFinanceData = undefined;
	public possibleError?: string = undefined;

	constructor(
		private readonly ticker: TickerId
	) { }

	getTicker() {
		return this.ticker;
	}

	getData() {
		return this.stockData;
	}

	async fetchData() {
		this.clearPossibleError();
		try {
			const response = await fetch(`${YAHOO_FINANCE_QUOTE}${this.ticker}`);
			const yahooFinanceResponse: YahooFinanceResponse = await response.json();

			// if (yahooFinanceResponse.quoteResponse.error) {
			// 	throw new Error(yahooFinanceResponse.quoteResponse.error);
			// }

			const stockData = parseYahooFinanceResponse(yahooFinanceResponse);
			this.stockData = stockData;
		} catch (e) {
			console.log(`FAILURE: ${JSON.stringify(e, null, 2)}`);
			this.stockData = undefined;
			this.setPossibleError(e.message);
		}
	}

	populateNews() {

	}

	getNews(): News {
		return this.news;
	}

	clearData() {
		this.stockData = undefined;
	}

	private setPossibleError(errorMessage: string) {
		this.possibleError = errorMessage;
	}

	private clearPossibleError() {
		this.possibleError = undefined;
	}

}

export type TickerId = string;
export type Tickers = Map<TickerId, Ticker>;