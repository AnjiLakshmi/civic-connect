import { Request, Response } from 'express';
import { getSuggestion } from '../utils/aiSuggestion';

export const suggest = (req: Request, res: Response) => {
  const { type } = req.query;
  if (typeof type !== 'string') return res.status(400).json({ msg: 'type query param required' });
  const suggestion = getSuggestion(type);
  res.json(suggestion);
};
