import { Context } from "../context/context";
import { Mode } from "./mode";
import { TIME_MARKET_OPEN, TIME_MARKET_CLOSE, TIME_PRE_OPEN } from "../constants/time";
import chalk from 'chalk';
import { Ticker, TickerId } from "../context/ticker";

function toFixedFormatter(item: number | undefined, toFixedLength: number, mode: Mode, ticker: string): string {
	if (item !== undefined) {
		return `${item.toFixed(toFixedLength)}${mode === Mode.PERCENTAGE ? '%' : ''}`;
	}
	return `No data for ${ticker}...`;
}

export const tickerFormatter = (ticker: Ticker, context: Context) => {
	let showAfterHours = context.showAfterHours && context.date.getHours() >= TIME_MARKET_CLOSE || context.date.getHours() < TIME_PRE_OPEN;
	let showPreHours = context.showPreHours && ((context.date.getHours() <= TIME_MARKET_OPEN && context.date.getMinutes() < 30)
		|| (context.date.getHours() < TIME_MARKET_OPEN && context.date.getHours() >= TIME_PRE_OPEN));
	const data = ticker.getData();
	const tickerId = ticker.getTicker();

	if (!data) {
		return chalk.red(`⌛`);
	}

	if (ticker.possibleError) {
		return chalk.red("⌛")
	}

	let numberToDisplay: string;
	let negative: boolean;
	switch (context.mode) {
		case Mode.PERCENTAGE: {
			if (showAfterHours) {
				numberToDisplay = `${toFixedFormatter(data.postMarketChangePercent, 3, context.mode, tickerId)}`;
			} else if (showPreHours) {
				numberToDisplay = `${toFixedFormatter(data.preMarketChangePercent, 3, context.mode, tickerId)}`;
			} else {
				numberToDisplay = `${toFixedFormatter(data.regularMarketChangePercent, 3, context.mode, tickerId)}`;
			}
			break;
		}
		case Mode.PRICE: {
			if (showAfterHours) {
				numberToDisplay = `${toFixedFormatter(data.postMarketChange, 2, context.mode, tickerId)}`;
			} else if (showPreHours) {
				numberToDisplay = `${toFixedFormatter(data.preMarketChange, 2, context.mode, tickerId)}`;
			} else {
				numberToDisplay = `${toFixedFormatter(data.regularMarketChange, 2, context.mode, tickerId)}`;
			}
			break;
		}
		case Mode.FULL: {
			if (showAfterHours) {
				numberToDisplay = `${toFixedFormatter(data.postMarketPrice, 2, context.mode, tickerId)}`;
			} else if (showPreHours) {
				numberToDisplay = `${toFixedFormatter(data.preMarketPrice, 2, context.mode, tickerId)}`;
			} else {
				numberToDisplay = `${toFixedFormatter(data.regularMarketPrice, 2, context.mode, tickerId)}`;
			}
			break;
		}
	}

	if (showAfterHours) {
		negative = data.postMarketChange < 0;
	} else if (showPreHours) {
		negative = data.preMarketChange < 0;
	} else {
		negative = data.regularMarketChange < 0;
	}

	if (negative) {
		return chalk.bgRed.white(`${ticker.getTicker()} ▼ ${numberToDisplay}`);
	} else {
		return chalk.bgGreen.black(`${ticker.getTicker()} ▲ ${numberToDisplay}`);
	}
}