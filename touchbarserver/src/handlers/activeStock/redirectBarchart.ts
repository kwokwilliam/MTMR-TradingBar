import { CustomHandler } from "../handler";
import { redirectGenerator } from "../../utils/redirect";
import { BARCHART } from "../../constants/urls";

export const redirectBarchart: CustomHandler = (req, res, options) => {
	res.send(redirectGenerator(`${BARCHART}${options.context.activeStock}`));
}