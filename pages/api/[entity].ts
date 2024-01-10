import fetch from 'node-fetch';
import type { NextApiRequest, NextApiResponse } from 'next';
import pluralize from 'pluralize';
import prisma from '@/prisma/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const getMaxId = async (modelName: string): Promise<string | null> => {
                try {
                    // @ts-ignore
                    const maxIdRecord = await prisma[modelName].findFirst({
                        orderBy: {
                            id: 'desc', // Supposant que 'id' est le champ d'identifiant
                        },
                    });
                    console.log('maxIdRecord', maxIdRecord)
                    return maxIdRecord ? maxIdRecord.id : null;
                } catch (error) {
                    console.error('Erreur lors de la récupération de l\'ID maximum:', error);
                    return null;
                }
            };
            const { data } = req.body;
            const entityName = pluralize(req.query.entity as string).toLowerCase();

            // Opération de base de données avec Prisma (si nécessaire)
            // @ts-ignore
            const result = await prisma[entityName].create({
                data: {
                    ...data,
                    id: (parseInt(await getMaxId(entityName) || '0') + 1).toString(),
                    created_at: new Date().toISOString(),
                    updated_at: null,
                },
            });

            // Exemple de requête vers un service externe avec node-fetch
            const externalUrl = `http://localhost:3001/api/${entityName}`;
            const externalResponse = await fetch(externalUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result),
            });
            const externalData = await externalResponse.json();

            // Traiter la réponse du service externe si nécessaire...

            res.status(200).json(externalData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la communication avec l\'API externe' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
