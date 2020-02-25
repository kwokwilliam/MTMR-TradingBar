import { RequestHandler } from 'express';
import { Context } from '../context/context';
import { CustomHandler } from './handler';

export const SchemeForwarder = (handler: CustomHandler, options: SchemeForwardingOptions): RequestHandler => {
	return (req, res) => {
		handler(req, res, options);
	}
}

export type SchemeForwardingOptions = {
	context: Context
}