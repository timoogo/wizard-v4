// pages/api/users/update.js
import { PrismaClient } from "@/prisma/generated/client";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            
            const { id, ...data } = req.body;
            const updatedUser = await prisma.user.create({
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
