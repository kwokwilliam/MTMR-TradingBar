import { CustomHandler } from "../handler";
import { redirectGenerator } from "../../utils/redirect";

export const getActiveNewsStory: CustomHandler = (req, res, options) => {
	const activeStory = options.context.getSelectedStory();
	const news = options.context.getNews();
	const config = options.context.getConfig();
	if (news && news.length > 0 && config) {
		const story = news[activeStory];
		const hoursAgo = story.options.dateHoursAgo || 0;
		res.send(` ${hoursAgo < 1 ? `${(hoursAgo * 60).toFixed(0)}m | ${story.title}` : `${hoursAgo.toFixed(0)}h | ${story.title}`} `);
	} else {
		res.send('⌛');
	}
}

export const redirectActiveNewsStory: CustomHandler = (req, res, options) => {
	const activeStory = options.context.getSelectedStory();
	const news = options.context.getNews();

	if (news && news.length > 0 && news.length > activeStory) {
		res.send(redirectGenerator(news[activeStory].url));
	} else if (news) {
		res.send(`Redirect failed... ${news[activeStory]?.url}`);
	} else {
		res.send(' ')
	}
}

export const getActiveStoryNumber: CustomHandler = (req, res, options) => {
	const activeStory = options.context.getSelectedStory();
	const news = options.context.getNews();

	if (news && news.length > 0) {
		res.send(`${activeStory + 1}/${news.length}`);
	} else {
		res.send('⌛');
	}
}

export const getActiveNewsLink: CustomHandler = (req, res, options) => {
	const activeStory = options.context.getSelectedStory();
	const news = options.context.getNews();

	if (news && news.length > 0 && news.length > activeStory) {
		res.send(news[activeStory].url);
	} else if (news) {
		res.send(`${news[activeStory]?.url}`);
	} else {
		res.send(' ')
	}
}