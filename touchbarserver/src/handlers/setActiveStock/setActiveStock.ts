import { CustomHandler } from "../handler";
import { STOCK } from "../../constants/urls";

export const setActiveStock: CustomHandler = (req, res, options) => {
	options.context.activeStock = req.params[STOCK];
	res.send(" ");
}