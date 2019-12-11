import { CustomHandler } from "../handler";
import { redirectGenerator } from "../../utils/redirect";
import { ROBINHOOD_STOCK } from "../../constants/urls";

export const redirectRobinhood: CustomHandler = (req, res, options) => {
	res.send(redirectGenerator(`${ROBINHOOD_STOCK}${options.context.activeStock}`));
}