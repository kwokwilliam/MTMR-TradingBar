import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { TickerId } from '../context/ticker';
import { YAHOO_NEWS_RSS_1, YAHOO_NEWS_RSS_2, YAHOO_NEWS_RSS_TOP, GOOGLE_NEWS_RSS_TOP, GOOGLE_NEWS_RSS_1, GOOGLE_NEWS_RSS_2 } from '../constants/urls';

export type News = NewsStory[]

export type NewsStory = {
	title: string,
	url: string,
	// source: string,
	options: NewsStoryOptions
}

export type NewsStoryOptions = {
	dateString?: string,
	dateHoursAgo?: number
}

enum NewsRSSTags {
	LINK = "link",
	PUB_DATE = "pubDate",
	TITLE = "title"
}

export const padNewsTitle = (title: string, length: number): string => {
	if (title.length >= length - 3) {
		return title.trim().substring(0, length - 3) + "...";
	}
	return title.trim().padEnd(length, ' ');
}

export const getNewsTicker = async (ticker?: TickerId): Promise<News> => {
	const res = await fetch(`${GOOGLE_NEWS_RSS_1}${ticker}${GOOGLE_NEWS_RSS_2}`);
	const pageText = await res.text();
	return parseNewsData(pageText);
}

export const getTopNews = async (): Promise<News> => {
	const res = await fetch(`${GOOGLE_NEWS_RSS_TOP}`);
	const pageText = await res.text();
	return parseNewsData(pageText);
}

export const parseNewsData = (pageText: string): News => {
	const $ = cheerio.load(pageText, { xmlMode: true });

	let news: News = [];
	// convert the items to a json object first. It is more performant than constant 1-deep
	// tree traversal.
	const items = $("item").toArray();
	items.forEach((item, i) => {
		let newsItem: Partial<NewsStory> = {};
		$(item).children().toArray().forEach(child => {
			let childData = child.childNodes[0]?.data;
			switch (child.tagName) {
				case NewsRSSTags.TITLE: {
					newsItem.title = childData;
					break;
				}
				case NewsRSSTags.LINK: {
					newsItem.url = childData;
					break;
				}
				case NewsRSSTags.PUB_DATE: {
					newsItem.options = {
						dateString: childData
					}
				}
			}
		});
		if (areAllKeysSet(newsItem)) {
			news.push(newsItem as NewsStory);
		}
	})
	news.forEach(item => {
		if (item.options && item.options.dateString) {
			const diff = Math.abs(Date.now() - (new Date(item.options.dateString).getTime())) / 36e5;
			item.options.dateHoursAgo = diff;
		}
	});
	news = news.sort((a, b) => a.options.dateHoursAgo! - b.options.dateHoursAgo!);
	return news;
}

function areAllKeysSet(newsItem: Partial<NewsStory>): boolean {
	let allKeysSet = false;
	if (
		newsItem.options?.dateString
		&& newsItem.title
		&& newsItem.url
	) {
		allKeysSet = true;
	}
	return allKeysSet;
}