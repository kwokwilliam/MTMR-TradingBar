export const parseYahooFinanceResponse = (res: YahooFinanceResponse): YahooFinanceData => {
	if (!res || !res.quoteResponse || !res.quoteResponse.result) {
		throw new Error("Invalid Yahoo Finance Response");
	}
	if (res.quoteResponse.result.length < 1) {
		throw new Error("No stock response")
	}
	const {
		postMarketChangePercent,
		postMarketChange,
		postMarketPrice,
		regularMarketChangePercent,
		regularMarketChange,
		regularMarketPrice,
		regularMarketDayHigh,
		preMarketChange,
		preMarketChangePercent,
		preMarketPrice

	} = res.quoteResponse.result[0]
	return {
		postMarketChangePercent,
		postMarketChange,
		postMarketPrice,
		regularMarketChangePercent,
		regularMarketChange,
		regularMarketPrice,
		regularMarketDayHigh,
		preMarketChange,
		preMarketChangePercent,
		preMarketPrice
	};
}

export type YahooFinanceData = {
	postMarketChangePercent: number,
	postMarketChange: number,
	postMarketPrice: number,
	regularMarketChangePercent: number,
	regularMarketChange: number,
	regularMarketPrice: number,
	regularMarketDayHigh: number,
	preMarketChange: number,
	preMarketChangePercent: number,
	preMarketPrice: number,
}

export type YahooFinanceResponse = {
	quoteResponse: {
		result: {
			language: string,
			region: string,
			quoteType: string,
			triggable: boolean,
			quoteSourceName: string,
			currency: string,
			postMarketChangePercent: number,
			postMarketChange: number,
			postMarketTime: number,
			postMarketPrice: number,
			regularMarketChange: number,
			regularMarketChangePercent: number,
			regularMarketPrice: number,
			regularMarketDayHigh: number,
			regularMarketDayRange: string,
			regularMarketDayLow: number,
			regularMarketVolume: number,
			regularMarketPreviousClose: number,
			preMarketChange: number,
			preMarketChangePercent: number,
			preMarketPrice: number,
			bid: number,
			ask: number,
			bidSize: number,
			askSize: number,
			fullExchangeName: string,
			financialCurrency: string,
			regularMarketOpen: number,
			averageDailyVolume3Month: number,
			averageDailyVolume10Day: number,
			fiftyTwoWeekLowChange: number,
			fiftyTwoWeekLowChangePercent: number,
			fiftyTwoWeekRange: string,
			fiftyTwoWeekHighChange: number,
			fiftyTwoWeekHighChangePercent: number,
			fiftyTwoWeekLow: number,
			fiftyTwoWeekHigh: number,
			dividendDate: number,
			earningsTimestamp: number,
			earningsTimestampStart: number,
			earningsTimestampEnd: number,
			trailingAnnualDividendRate: number,
			trailingPE: number,
			trailingAnnualDividendYield: number,
			marketState: string,
			epsTrailingTwelveMonths: number,
			epsForward: number,
			sharesOutstanding: number,
			bookValue: number,
			fiftyDayAverage: number,
			fiftyDayAverageChange: number,
			fiftyDayAverageChangePercent: number,
			twoHundredDayAverage: number,
			twoHundredDayAverageChange: number,
			twoHundredDayAverageChangePercent: number,
			marketCap: number,
			forwardPE: number,
			priceToBook: number,
			sourceInterval: number,
			exchangeDataDelayedBy: number,
			tradeable: boolean,
			exchange: string,
			shortName: string,
			longName: string,
			messageBoardId: string,
			exchangeTimezoneName: string,
			exchangeTimezoneShortName: string,
			gmtOffSetMilliseconds: number,
			market: string,
			esgPopulated: boolean,
			firstTradeDateMilliseconds: number,
			priceHint: number,
			symbol: string
		}[],
		error?: string
	}
}