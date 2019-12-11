import { Request, Response } from "express";
import { SchemeForwardingOptions } from './schemeForwarder';

export type CustomHandler = (req: Request, res: Response, options: SchemeForwardingOptions) => void;