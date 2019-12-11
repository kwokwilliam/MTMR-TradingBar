import { Tickers, Ticker, TickerId } from "./ticker";
import fs from 'fs';
import { Config } from "../utils/config";
import { Mode } from "../utils/mode";
import { getNewsTicker, News, getTopNews } from "../utils/news";

export class Context {
	private tickers: Tickers = new Map();
	private config?: Config;
	private fetchInterval?: NodeJS.Timeout;
	public mode: Mode = Mode.PRICE;
	public showAfterHours: boolean = true;
	public showPreHours: boolean = true;
	public date: Date = new Date();
	public testCounter = 0;
	public activeStock?: TickerId;
	private news?: News;
	private selectedStory: number = 0;

	constructor(
		public port: number,
		public host: string,
		public configLocation: string,
		public mtmrConfigLocation: string,
		public mtmrCodeLocation: string,
		public robinhoodLogoLocation: string,
		public barchartLogoLocation: string,
		public spyImageLocation: string,
		public configHtmlLocation: string
	) { }

	fetchNewConfig() {
		this.config = JSON.parse(fs.readFileSync(this.configLocation, "UTF-8"));
		Context.populateTickers(this);
	}

	setConfig(config: Config) {
		this.config = config;
	}

	getConfig(): Config | undefined {
		return this.config;
	}

	addTicker(tickerId: TickerId, ticker: Ticker) {
		this.tickers.set(tickerId, ticker);
	}

	clearTickers() {
		this.tickers.clear();
	}

	getTickers(): Tickers {
		return this.tickers;
	}

	getTicker(tickerId: TickerId): Ticker {
		if (!this.tickers.has(tickerId)) {
			throw new Error("Ticker not found");
		}

		return this.tickers.get(tickerId)!;
	}

	startFetching() {
		if (!this.fetchInterval) {
			this.fetchInterval = setInterval(() => {
				this.tickers.forEach((ticker) => {
					ticker.fetchData();
				});
				this.date = new Date();
			}, 750);
		}
	}

	stopFetching() {
		if (this.fetchInterval) {
			clearTimeout(this.fetchInterval);
			this.fetchInterval = undefined;
			this.tickers.forEach(ticker => {
				ticker.clearData();
			})
		}
	}

	async fetchNews(general?: boolean) {
		this.news = undefined;
		this.selectedStory = 0;
		if (this.activeStock) {
			const news = general ? await getTopNews() : await getNewsTicker(this.activeStock);
			this.news = news;
		}
		// diff < 1 ? "< 1h" : `${diff.toFixed(0)}h`
		// 
	}

	getNews() {
		return this.news;
	}

	getSelectedStory() {
		return this.selectedStory;
	}

	setSelectedStory(story: number) {
		this.selectedStory = story;
	}

	static setContextConfig(context: Context, config: Config) {
		context.setConfig(config);
	}

	static async populateTickers(context: Context) {
		context.clearTickers();
		const config = context.getConfig();
		if (!config) {
			throw new Error("Error populating tickers: Config not found");
		}

		config.stocksToWatch.forEach((stock, i) => {
			if (i === 0) {
				context.activeStock = stock;
			}
			const newStock = new Ticker(stock);
			context.addTicker(stock, newStock);
		});
	}
}