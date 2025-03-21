import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated, isAdmin } from '../middlewares/middleware';
/// <reference path="../types/express/index.d.ts" />

const router = Router();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'supersegreto';

// ROUTE PUBBLICHE
router.post('/rest/login', async (req: Request, res: Response) => {
    // ...
  });
router.get('/rest/products/public', async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  const simplified = products.map(p => ({
    name: p.name,
    disponibilita: p.quantity > 0 ? 'Disponibile' : 'Non disponibile',
  }));
  res.json(simplified);
});

// ROUTE PRIVATE
router.get('/rest/user', isAuthenticated, (req: Request & { user?: any }, res: Response) => {
  res.json(req.user);
});

router.get('/rest/products', isAuthenticated, async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.post('/rest/product/:id', isAuthenticated, async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const { quantity } = req.body;
  
  const updated = await prisma.product.update({
    where: { id: productId },
    data: { quantity },
  });
  
  res.json(updated);
});

// ROUTE ADMIN
router.post('/rest/product', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
  const { name, quantity } = req.body;
  const product = await prisma.product.create({ data: { name, quantity } });
  res.json(product);
});

router.delete('/rest/product/:id', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  await prisma.product.delete({ where: { id: productId } });
  res.json({ message: 'Prodotto eliminato' });
});

router.get('/rest/users', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, isAdmin: true },
  });
  res.json(users);
});

export default router;