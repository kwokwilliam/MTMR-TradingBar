import { CustomHandler } from "../handler";
import { Config, modifyConfig } from "../../utils/config";

export const setConfig: CustomHandler = async (req, res, options) => {
	const config = req.body.config;
	const valid = verifyConfig(config);
	if (valid) {
		await modifyConfig(options.context, config);
	}

	res.json({
		success: valid
	});
}

// just check if the main keys are there tbh lol
function verifyConfig(config: Partial<Config>): boolean {
	const {
		stocksToWatch,
		mtmrRight,
		stocksButtonInformation,
		stockButtonBase,
		customButtons,
		showEscape,
		lengthNewsTitle,
		lengthNewsTitleButton
	} = config;

	if (
		stocksToWatch === undefined
		|| mtmrRight === undefined
		|| stocksButtonInformation === undefined
		|| stockButtonBase === undefined
		|| customButtons === undefined
		|| showEscape === undefined
		|| lengthNewsTitle === undefined
		|| lengthNewsTitleButton === undefined
	) {
		return false;
	}

	return true;
}