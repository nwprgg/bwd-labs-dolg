import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

interface HttpError extends Error {
  statusCode?: number;
}

const errorHandler: ErrorRequestHandler<
  ParamsDictionary,
  any,
  any,
  ParsedQs
> = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
};

export default errorHandler;
