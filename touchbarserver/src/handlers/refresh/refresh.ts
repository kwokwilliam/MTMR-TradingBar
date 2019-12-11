import { CustomHandler } from "../handler";
import { modifyConfig } from "../../utils/config";

export const refreshMTMR: CustomHandler = (req, res, options) => {
	const oldConfig = options.context.getConfig();
	if (oldConfig) {
		modifyConfig(options.context, oldConfig);
	}
	res.send(" ");
}