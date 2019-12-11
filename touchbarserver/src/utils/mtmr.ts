import { Context } from "../context/context";
import { Config } from "./config";
import { FETCH_START, TICKER, SET_ACTIVE_STOCK, CURL_LOCATION, ACTIVE_STOCK_GET_TICKER, ACTIVE_STOCK_GET_ID, ROBINHOOD_STOCK, BARCHART, ACTIVE_STOCK_REDIRECT_ROBINHOOD, ACTIVE_STOCK_REDIRECT_BARCHART, GET_TICKER_MODE, TOGGLE_TICKER, ACTIVE_STOCK_COMPARE_TO_SPY, NEWS_GET_ACTIVE_URL, NEWS_GET_ACTIVE_STORY, NEWS_FETCH_ACTIVE, NEWS_DECREMENT, NEWS_INCREMENT, NEWS_GET_STORY_NUMBER, NEWS_FETCH_ACTIVE_GENERAL, CONFIG, NEWS_GET_ACTIVE_URL_COPY } from "../constants/urls";
import { ChalkFunction } from "chalk";
import chalk from 'chalk';

function generatePercentToggle(context: Context, config: Config): MTMRItem {
	return {
		type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
		align: MTMRAlign.RIGHT,
		source: {
			inline: `curl ${generateHostPortUrl(context, GET_TICKER_MODE)}`
		},
		refreshInterval: 1,
		action: MTMRActions.SHELL_SCRIPT,
		executablePath: CURL_LOCATION,
		shellArguments: [
			`${generateHostPortUrl(context, TOGGLE_TICKER)}`
		],
		autoResize: true
	};
}

function generateMenuButton(context: Context, config: Config): MTMRItem {
	return {
		type: MTMRTypes.GROUP,
		align: MTMRAlign.RIGHT,
		autoResize: true,
		title: "Open Active",
		items: createStockMenu(context, config)
	}
}

function generateSpacer(width: number, align?: boolean): MTMRItem {
	let spacer: MTMRItem = {
		type: MTMRTypes.STATIC_BUTTON,
		title: " ",
		width,
		bordered: false,
	};

	if (align) {
		spacer.align = MTMRAlign.RIGHT;
	}
	return spacer;
}

function generateActiveStockPreview(context: Context, config: Config): MTMRItem {
	return {
		type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
		source: {
			inline: `curl ${generateHostPortUrl(context, ACTIVE_STOCK_GET_ID)}`
		},
		align: MTMRAlign.RIGHT,
		refreshInterval: 1,
		autoResize: true
	}
}

export const generateMTMRConfig = (context: Context): string => {
	const config = context.getConfig();
	if (!config) {
		throw new Error("Unable to locate configuration.")
	}

	let finalMTMRConfig: MTMRItem[] = [];
	let right = [...config.mtmrRight];
	right.unshift(generateMenuButton(context, config));
	right.unshift(generateActiveStockPreview(context, config));
	right.unshift(generatePercentToggle(context, config));
	right.unshift({
		type: MTMRTypes.STATIC_BUTTON,
		title: "Code",
		align: MTMRAlign.RIGHT,
		width: 50,
		action: MTMRActions.APPLE_SCRIPT,
		actionAppleScript: {
			inline: `activate application "Visual Studio Code"\rtell application "Visual Studio Code" to open ("${context.mtmrCodeLocation}" as POSIX file)`
		}
	});
	right.unshift(
		generateSpacer(10),
		generateLinkButton(generateHostPortUrl(context, CONFIG), "Edit", true)
	)

	const toConcat: MTMRItem[][] = [
		config.showEscape ? [{
			type: MTMRTypes.ESCAPE_BUTTON
		}] : [],
		[
			generateStockButton(context, config, true),
			generateSpacer(2),
			generateStockButton(context, config, false, "only stonks"),
			generateSpacer(10),
			generateLinkButton(`https://tradingview.com/chart/`, " 📊 TradingView "),
			generateSpacer(10),
			generateNewsMenu(context, config, true),
			generateSpacer(10),
		],
		config.customButtons,
		right
	];

	toConcat.forEach(mtmrItem => {
		finalMTMRConfig = finalMTMRConfig.concat(mtmrItem);
	})

	return JSON.stringify(finalMTMRConfig, null, 2);
}

function generateCloseButton(): MTMRItem {
	return {
		type: MTMRTypes.CLOSE_BUTTON,
		width: 64
	}
}

function generateStockButton(context: Context, config: Config, showRight: boolean, title?: string): MTMRItem {
	const stocksButtonInformation = { ...config.stocksButtonInformation };

	if (title) {
		stocksButtonInformation.title = title;
	}

	const stockButtons: MTMRItem[] = [
		generateCloseButton()
	];

	config.stocksToWatch.map(ticker => {
		stockButtons.push({
			...config.stockButtonBase,
			source: {
				inline: `curl ${generateHostPortUrl(context, TICKER)}${ticker}`
			},
			longAction: MTMRActions.OPEN_URL,
			longUrl: `${ROBINHOOD_STOCK}${ticker}`,
			action: MTMRActions.SHELL_SCRIPT,
			executablePath: CURL_LOCATION,
			shellArguments: [
				`${generateHostPortUrl(context, SET_ACTIVE_STOCK)}${ticker}`
			],
		});
	});

	// Hidden button after
	stockButtons.push({
		type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
		width: 2,
		bordered: false,
		autoResize: true,
		source: {
			inline: `curl ${generateHostPortUrl(context, FETCH_START)}`
		}
	});
	stockButtons.push(generatePercentToggle(context, config));
	if (showRight) {
		stockButtons.push(generateActiveStockPreview(context, config));
		stockButtons.push(generateMenuButton(context, config));
	}

	return {
		...stocksButtonInformation,
		items: stockButtons
	}
}

function createStockMenu(context: Context, config: Config): MTMRItem[] {
	return [
		generateCloseButton(),
		generateSpacer(10),
		{
			...config.stockButtonBase,
			source: {
				inline: `curl ${generateHostPortUrl(context, ACTIVE_STOCK_GET_TICKER)}`
			}
		},
		generateSpacer(10),
		generateImageLinkButton(generateHostPortUrl(context, ACTIVE_STOCK_REDIRECT_ROBINHOOD), context.robinhoodLogoLocation, chalk.green(" Robinhood")),
		generateSpacer(10),
		generateImageLinkButton(generateHostPortUrl(context, ACTIVE_STOCK_REDIRECT_BARCHART), context.barchartLogoLocation, chalk.black.bgCyan(" Barchart")),
		generateSpacer(10),
		generateImageLinkButton(generateHostPortUrl(context, ACTIVE_STOCK_COMPARE_TO_SPY), context.spyImageLocation, chalk.bgWhite.black(" Compare SPY")),
		generateSpacer(10),
		generateNewsMenu(context, config)
	];
}

function generateNewsMenu(context: Context, config: Config, general?: boolean): MTMRItem {
	let newsMenuItems: MTMRItem[] = [
		generateSpacer(10),
		{
			type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
			action: MTMRActions.OPEN_URL,
			url: generateHostPortUrl(context, NEWS_GET_ACTIVE_URL),
			source: {
				inline: `curl ${generateHostPortUrl(context, NEWS_GET_ACTIVE_STORY)}`
			},
			longAction: MTMRActions.APPLE_SCRIPT,
			longActionAppleScript: {
				inline: `do shell script "curl ${generateHostPortUrl(context, NEWS_GET_ACTIVE_URL_COPY)} | pbcopy"`,
			},
			refreshInterval: 0.5,
			autoResize: true
		},
		generateSpacer(15),
		{
			type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
			width: 2,
			bordered: false,
			autoResize: true,
			source: {
				inline: `curl ${generateHostPortUrl(context,
					general ? NEWS_FETCH_ACTIVE_GENERAL : NEWS_FETCH_ACTIVE
				)}`
			}
		},
		{
			type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
			align: MTMRAlign.RIGHT,
			source: {
				inline: `echo ${chalk.bgBlue.white("←")}`
			},
			refreshInterval: 10,
			action: MTMRActions.SHELL_SCRIPT,
			executablePath: CURL_LOCATION,
			shellArguments: [
				`${generateHostPortUrl(context, NEWS_DECREMENT)}`
			],
			autoResize: true,
			width: 50
		},

		{
			type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
			align: MTMRAlign.RIGHT,
			source: {
				inline: `curl ${generateHostPortUrl(context, NEWS_GET_STORY_NUMBER)}`
			},
			refreshInterval: 1,
			autoResize: true,
			width: 50
		},
		{
			type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
			align: MTMRAlign.RIGHT,
			source: {
				inline: `echo ${chalk.bgBlue.white("→")}`
			},
			refreshInterval: 10,
			action: MTMRActions.SHELL_SCRIPT,
			executablePath: CURL_LOCATION,
			shellArguments: [
				`${generateHostPortUrl(context, NEWS_INCREMENT)}`
			],
			autoResize: true,
			width: 50
		},
		generateSpacer(10, true),
		{
			type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
			align: MTMRAlign.RIGHT,
			source: {
				inline: `echo ${chalk.bgGreen.black("↻")}`
			},
			refreshInterval: 10,
			action: MTMRActions.SHELL_SCRIPT,
			executablePath: CURL_LOCATION,
			shellArguments: [
				`${generateHostPortUrl(context,
					general ? NEWS_FETCH_ACTIVE_GENERAL : NEWS_FETCH_ACTIVE
				)}`
			],
			autoResize: true,
			width: 50
		}
	]

	if (!general) {
		newsMenuItems.unshift(
			{
				...config.stockButtonBase,
				source: {
					inline: `curl ${generateHostPortUrl(context, ACTIVE_STOCK_GET_TICKER)}`
				}
			}
		)
	}

	newsMenuItems.unshift(
		generateCloseButton(),
		generateSpacer(10)
	);

	if (config.showEscape) {
		newsMenuItems.unshift({
			type: MTMRTypes.ESCAPE_BUTTON
		});
	}

	return {
		type: MTMRTypes.GROUP,
		title: "News",
		items: newsMenuItems
	}
}

function generateLinkButton(link: string, title: string, alignRight?: boolean): MTMRItem {
	const linkButton: MTMRItem = {
		type: MTMRTypes.STATIC_BUTTON,
		action: MTMRActions.OPEN_URL,
		url: link,
		title,
		autoResize: true,
		refreshInterval: 1
	};

	if (alignRight) {
		linkButton.align = MTMRAlign.RIGHT;
	}

	return linkButton;
}

function generateImageLinkButton(link: string, image: string, title: string): MTMRItem {
	return {
		type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
		action: MTMRActions.OPEN_URL,
		url: link,
		// title,
		source: {
			inline: `echo ${title}`
		},
		image: {
			filePath: image
		},
		autoResize: true
	}
}

function generateHostPortUrl(context: Context, end: string) {
	return `${context.host}:${context.port}${end}`;
}

export enum MTMRTypes {
	ESCAPE_BUTTON = "escape",
	STATIC_BUTTON = "staticButton",
	APPLE_SCRIPT_TITLED_BUTTON = "appleScriptTitledButton",
	SHELL_SCRIPT_TITLED_BUTTON = "shellScriptTitledButton",
	CLOSE_BUTTON = "close",
	GROUP = "group",
	BRIGHTNESS = "brightness",
	VOLUME = "volume",
	TIME_BUTTON = "timeButton"
};

export enum MTMRActions {
	OPEN_URL = "openUrl",
	APPLE_SCRIPT = "appleScript",
	SHELL_SCRIPT = "shellScript"
}

export enum MTMRAlign {
	LEFT = "left",
	CENTER = "center",
	RIGHT = "right"
}

export type MTMRSource = {
	filePath: string
} | {
	inline: string
} | {
	base64: string
}

export type MTMRItem = {
	width?: number,
	align?: MTMRAlign,
	bordered?: boolean,
	refreshInterval?: number,
	autoResize?: boolean
} & (
		{
			type: MTMRTypes.ESCAPE_BUTTON
		} |
		{
			/** Static Button */
			type: MTMRTypes.STATIC_BUTTON,
			title: string,
			action?: MTMRActions,
			actionAppleScript?: MTMRSource,
			url?: string
		} | {
			/** Apple Script Titled Button */
			type: MTMRTypes.APPLE_SCRIPT_TITLED_BUTTON,
			source: MTMRSource
		} | {
			/** Close Button */
			type: MTMRTypes.CLOSE_BUTTON,
		} | {
			/** Shell Script Titled Button */
			type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
			source?: MTMRSource,
			action?: MTMRActions,
			url?: string,
			longAction?: MTMRActions,
			longActionAppleScript?: MTMRSource,
			longUrl?: string,
			shellArguments?: string[],
			executablePath?: string,
			autoResize: boolean,
			image?: {
				filePath?: string,
				base64?: string
			},
			title?: string
		} | {
			/** Group */
			type: MTMRTypes.GROUP,
			title?: string,
			items: MTMRItem[],
			source?: MTMRSource
		} | {
			/** Brightness */
			type: MTMRTypes.BRIGHTNESS,
			image: MTMRSource
		} | {
			/** Volume */
			type: MTMRTypes.VOLUME
		} | {
			/** Time Button */
			type: MTMRTypes.TIME_BUTTON,
			formatTemplate: string,
		}
	);