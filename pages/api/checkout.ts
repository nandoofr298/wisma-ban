// pages/api/checkout.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type CheckoutData = {
  total: number;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<CheckoutData>) {
  if (req.method === 'POST') {
    fetch("http://localhost:3001/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    })
      .then((response) => response.json())
      .then((data) => res.status(200).json(data))
      .catch(() => res.status(500).json({ total: 0 }));
  } else {
    res.status(405).json({ total: 0 });
  }
}
