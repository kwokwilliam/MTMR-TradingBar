import { TickerId } from "../context/ticker";
import { Context } from "../context/context";
import fs from 'fs';
import { generateMTMRConfig, MTMRItem, MTMRTypes, MTMRAlign, MTMRActions } from "./mtmr";

export type Config = {
	stocksToWatch: TickerId[],
	mtmrRight: MTMRItem[],
	stocksButtonInformation: {
		type: MTMRTypes.GROUP,
		align: MTMRAlign.CENTER,
		bordered: boolean,
		title: string
	},
	stockButtonBase: {
		type: MTMRTypes.SHELL_SCRIPT_TITLED_BUTTON,
		align: MTMRAlign.CENTER,
		bordered: boolean,
		autoResize: boolean,
		// width: number,
		refreshInterval: number
	},
	customButtons: MTMRItem[],
	showEscape: boolean,
	lengthNewsTitle: number,
	lengthNewsTitleButton: number
};

export const modifyConfig = async (context: Context, newConfig: Config) => {
	Context.setContextConfig(context, newConfig);
	const configJson = JSON.stringify(newConfig, null, 2);
	fs.writeFileSync(`${context.configLocation}`, configJson);
	await Context.populateTickers(context);
	// refresh mtmr by refreshing mtmrcfg
	fs.writeFileSync(context.mtmrConfigLocation, generateMTMRConfig(context));
	// console.log(generateMTMRConfig(context));
	// console.log(context.mtmrConfigLocation)

	return undefined;
}                   