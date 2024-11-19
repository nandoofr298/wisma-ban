// pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Product[]>) {
  if (req.method === 'GET') {
    // Get products from Express API (through fetch)
    fetch("http://localhost:3001/api/products")
      .then((response) => response.json())
      .then((data) => res.status(200).json(data))
      .catch(() => res.status(500).json([]));
  } else {
    res.status(405).json([]);
  }
}
