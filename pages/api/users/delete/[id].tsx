import prisma from "@/prisma/prisma";
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        
        const { id } = req.query;

        try {
            await prisma.user.delete({
                where: {
                    id: Number(id),
                },
            });
            res.status(200).json({ message: 'Utilisateur supprimé' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression de l utilisateur' });
        } finally {
            await prisma.$disconnect();
        }
    }
}
