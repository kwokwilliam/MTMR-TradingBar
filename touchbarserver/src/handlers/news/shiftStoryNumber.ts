import { CustomHandler } from "../handler";

export const incrementNews: CustomHandler = (req, res, options) => {
	let story = options.context.getSelectedStory();
	let newsItems = options.context.getNews();

	if (newsItems) {
		story = (story + 1) % newsItems.length;
	}

	options.context.setSelectedStory(story);
	res.send(' ');
}

export const decrementNews: CustomHandler = (req, res, options) => {
	let story = options.context.getSelectedStory();
	let newsItems = options.context.getNews();

	if (newsItems) {
		story = story === 0 ? newsItems.length - 1 : (story - 1) % newsItems.length;
	}

	options.context.setSelectedStory(story);
	res.send(' ');
}

