import express from 'express';
import { Context } from './context/context';
import { STOCK, TICKER, FETCH_START, FETCH_STOP, TESTER_SHOW, TESTER_INCREMENT, REFRESH, SET_ACTIVE_STOCK, ACTIVE_STOCK_REDIRECT_ROBINHOOD, ACTIVE_STOCK_GET_TICKER, ACTIVE_STOCK_GET_ID, ACTIVE_STOCK_REDIRECT_BARCHART, TOGGLE_TICKER, GET_TICKER_MODE, ACTIVE_STOCK_COMPARE_TO_SPY, NEWS_FETCH_ACTIVE, NEWS_DECREMENT, NEWS_INCREMENT, NEWS_GET_ACTIVE_STORY, NEWS_GET_ACTIVE_URL, NEWS_GET_STORY_NUMBER, NEWS_FETCH_ACTIVE_GENERAL, CONFIG, GET_CONFIG, SET_CONFIG, NEWS_GET_ACTIVE_URL_COPY } from './constants/urls';
import { SchemeForwarder } from './handlers/schemeForwarder';
import { tickersGet } from './handlers/tickers/tickersGet';
import { Config, modifyConfig } from './utils/config';
import fs from 'fs';
import { fetchStart, fetchStop } from './handlers/fetch/fetch';
import { testerCountShow, testerCountIncrement } from './handlers/tester/tester';
import { refreshMTMR } from './handlers/refresh/refresh';
import { setActiveStock } from './handlers/setActiveStock/setActiveStock';
import { redirectRobinhood } from './handlers/activeStock/redirectRobinhood';
import { getTickerActiveStock } from './handlers/activeStock/getTicker';
import { getTickerId } from './handlers/activeStock/getTickerId';
import { startCheckMTMRRunning } from './utils/applescript';
import { redirectBarchart } from './handlers/activeStock/redirectBarchart';
import { tickerToggle } from './handlers/tickers/tickerToggle';
import { getTickerMode } from './handlers/tickers/getTickerMode';
import { getNewsTicker } from './utils/news';
import { redirectCompareSpy } from './handlers/activeStock/redirectCompareSpy';
import { newsFetch, newsFetchGeneral } from './handlers/news/fetch';
import { decrementNews, incrementNews } from './handlers/news/shiftStoryNumber';
import { getActiveNewsStory, redirectActiveNewsStory, getActiveStoryNumber, getActiveNewsLink } from './handlers/news/activeStory';
import { configHtml } from './handlers/config/configHtml';
import { getConfig } from './handlers/config/getConfig';
import { setConfig } from './handlers/config/setConfig';

// set up environment variables
const port = process.env.PORT && Number(process.env.PORT) || 9999;
const host = process.env.HOST || "http://localhost";
const configLocation = process.env.CONFIG_LOCATION || "~/.mtmrconfig.jsonc"
const mtmrConfigLocation = process.env.MTMR_CONFIG_LOCATION || "~/Library/Application Support/MTMR/items.json";
const mtmrCodeLocation = process.env.MTMR_CODE || "~/Desktop/MTMR-TradingBar"
const robinhoodLogoLocation = process.env.ROBINHOOD_LOGO || "";
const barchartLogoLocation = process.env.BARCHART_LOGO || "";
const spyImageLocation = process.env.SPY_IMAGE || "";
const configHtmlLocation = process.env.CONFIG_HTML || "";

const app = express();
app.use(express.json()); // TODO: might not need
const context = new Context(
	port,
	host,
	configLocation,
	mtmrConfigLocation,
	mtmrCodeLocation,
	robinhoodLogoLocation,
	barchartLogoLocation,
	spyImageLocation,
	configHtmlLocation
);

app.get(`${TICKER}:${STOCK}`, SchemeForwarder(tickersGet, { context }));
app.get(FETCH_START, SchemeForwarder(fetchStart, { context }));
app.get(FETCH_STOP, SchemeForwarder(fetchStop, { context }));
app.get(TESTER_SHOW, SchemeForwarder(testerCountShow, { context }));
app.get(TESTER_INCREMENT, SchemeForwarder(testerCountIncrement, { context }));
app.get(REFRESH, SchemeForwarder(refreshMTMR, { context }));
app.get(`${SET_ACTIVE_STOCK}:${STOCK}`, SchemeForwarder(setActiveStock, { context }));
app.get(`${ACTIVE_STOCK_GET_ID}`, SchemeForwarder(getTickerId, { context }))
app.get(`${ACTIVE_STOCK_REDIRECT_ROBINHOOD}`, SchemeForwarder(redirectRobinhood, { context }));
app.get(`${ACTIVE_STOCK_REDIRECT_BARCHART}`, SchemeForwarder(redirectBarchart, { context }));
app.get(`${ACTIVE_STOCK_GET_TICKER}`, SchemeForwarder(getTickerActiveStock, { context }));
app.get(`${TOGGLE_TICKER}`, SchemeForwarder(tickerToggle, { context }));
app.get(`${GET_TICKER_MODE}`, SchemeForwarder(getTickerMode, { context }));
app.get(ACTIVE_STOCK_COMPARE_TO_SPY, SchemeForwarder(redirectCompareSpy, { context }));
app.get(NEWS_FETCH_ACTIVE, SchemeForwarder(newsFetch, { context }));
app.get(NEWS_DECREMENT, SchemeForwarder(decrementNews, { context }));
app.get(NEWS_INCREMENT, SchemeForwarder(incrementNews, { context }));
app.get(NEWS_GET_ACTIVE_STORY, SchemeForwarder(getActiveNewsStory, { context }));
app.get(NEWS_GET_ACTIVE_URL, SchemeForwarder(redirectActiveNewsStory, { context }));
app.get(NEWS_GET_STORY_NUMBER, SchemeForwarder(getActiveStoryNumber, { context }));
app.get(NEWS_GET_ACTIVE_URL_COPY, SchemeForwarder(getActiveNewsLink, { context }));
app.get(NEWS_FETCH_ACTIVE_GENERAL, SchemeForwarder(newsFetchGeneral, { context }));
app.get(CONFIG, SchemeForwarder(configHtml, { context }));
app.get(GET_CONFIG, SchemeForwarder(getConfig, { context }));
app.post(SET_CONFIG, SchemeForwarder(setConfig, { context }));

async function main() {
	try {
		const configString = fs.readFileSync(configLocation, "UTF-8");
		const config: Config = JSON.parse(configString);
		await modifyConfig(context, config);
	} catch (e) {
		console.log(e.message);
		process.exit(1);
	}

	app.listen(port, () => {
		context.startFetching();
		startCheckMTMRRunning(context);
		console.log(`Server listening on port ${port}`);
	}).on('error', () => {
		// Fail silently
		process.exit(0);
	});
}

main();