import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../config';
import { Bot } from "grammy";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const bot = new Bot(process.env.BOT_TOKEN, {client: {
    environment: process.env.ENV.toLowerCase() == "test" ? "test" : "prod"
  }}); 
  const title = "Test Product";
  const description = "Test description";
  const payload = "{}";
  const currency = "XTR";
  const prices = [{ amount: 100, label: "Test Product" }];

  const invoiceLink = await bot.api.createInvoiceLink(
    title,
    description,
    payload,
    "", // Provider token must be empty for Telegram Stars
    currency,
    prices,
  );

  res.status(200).json({ invoiceLink });
}
