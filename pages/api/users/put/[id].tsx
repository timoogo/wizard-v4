// pages/api/users/update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@/prisma/generated/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const prisma = new PrismaClient();
            const { id, ...data } = req.body;
            const updatedUser = await prisma.user.update({
                where: { id: Number(id) },
                data,
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}
