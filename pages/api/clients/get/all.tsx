// pages/api/users/update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@/prisma/generated/client';




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const users = await prisma.user.findMany(); // Using Prisma to fetch users
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}