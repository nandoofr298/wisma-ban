// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
