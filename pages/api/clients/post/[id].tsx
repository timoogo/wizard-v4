// pages/api/users/update.js
import { PrismaClient } from "@/prisma/generated/client";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Deconstructing the body and excluding the id, if it's passed
            const { id, ...data } = req.body;

            const createdUser = await prisma.user.create({
                data: {
                    ...data,
                    created_at: new Date(), // Set the current timestamp
                    updated_at: null,      // Set updated_at as null
                },
            });
            res.status(200).json(createdUser);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la création de l'utilisateur", message: error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}