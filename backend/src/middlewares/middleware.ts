/// <reference path="../types/express/index.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const SECRET = process.env.JWT_SECRET || 'supersegreto';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token mancante' });
    return;
  }

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user as any;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token non valido' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Accesso negato: non sei admin' });
  }
};