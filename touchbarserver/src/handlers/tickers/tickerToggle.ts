import { CustomHandler } from "../handler";
import { Mode } from "../../utils/mode";

export const tickerToggle: CustomHandler = (req, res, options) => {
	switch (options.context.mode) {
		case Mode.PERCENTAGE: {
			options.context.mode = Mode.PRICE;
			break;
		}
		case Mode.PRICE: {
			options.context.mode = Mode.FULL;
			break;
		}
		case Mode.FULL: {
			options.context.mode = Mode.PERCENTAGE;
			break;
		}
	}

	res.send(' ');
}