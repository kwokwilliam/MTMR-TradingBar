import { CustomHandler } from "../handler";
import { redirectGenerator } from "../../utils/redirect";
import {
	BARCHART_COMPARE_TO_SPY_1,
	BARCHART_COMPARE_TO_SPY_2,
	BARCHART_COMPARE_TO_SPY_3,
	BARCHART_COMPARE_TO_SPY_4,
	BARCHART_COMPARE_TO_SPY_5,
	BARCHART_COMPARE_TO_SPY_6
} from "../../constants/urls";

export const redirectCompareSpy: CustomHandler = (req, res, options) => {
	const active = options.context.activeStock;
	const currentDay = new Date();
	const pastDay = new Date();
	pastDay.setDate(pastDay.getDate() - 2);
	res.send(redirectGenerator(
		BARCHART_COMPARE_TO_SPY_1 +
		active +
		BARCHART_COMPARE_TO_SPY_2 +
		pastDay.toISOString().split("T")[0] +
		BARCHART_COMPARE_TO_SPY_3 +
		currentDay.toISOString().split("T")[0] +
		BARCHART_COMPARE_TO_SPY_4 +
		active +
		BARCHART_COMPARE_TO_SPY_5 +
		active +
		BARCHART_COMPARE_TO_SPY_6
	));
}