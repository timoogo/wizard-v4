import React from 'react';
import { FaUser } from 'react-icons/fa';
import StatCard from '@/librairy/components/StatCard';
import { PrismaClient } from '@/prisma/generated/client'
import Head from "next/head";
import {modelToTypes} from "@/librairy/utils/modelToTypes";
import path from "path";

interface StatData {
    totalUsers: number;
}

const IndexPage = ({ statData }: { statData: StatData }) => {
    let pageTitle = 'Dashboard';
    return (
        <>
        <Head>
            <title>{pageTitle}</title>
        </Head>
        <div className="bg-gray-200 p-4 min-h-screen">

                <div className="flex flex-col py-2">
                <h1 className="text-6xl py-2 ">Dashboard</h1>
                <div className="flex flex-row flex-wrap">
                    <StatCard
                        title="Total Users"
                        value={`${statData.totalUsers}`}
                        description="Total Users"
                        icon={<FaUser />}
                        redirection='/users'
                        accessibilityLabel='Total Users'
                    />
                    <StatCard
                        title="Total Clients"
                        value={`${statData.totalUsers}`}
                        description="Total clients"
                        icon={<FaUser />}
                        redirection='/clients'
                        accessibilityLabel='Total clients'
                    />
                    {/* Ajoutez plus de composants StatCard pour d'autres statistiques */}
                </div>
            </div>
        </div>
        </>
    );
};

export async function getServerSideProps() {
    const jsonFilePath = path.join(process.cwd(), 'prisma/generated/json/json-schema.json');

    const generateTypes = modelToTypes(jsonFilePath)

    console.log(generateTypes)
    try {
        const prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
        // Utilisation de Prisma pour récupérer les utilisateurs
        const users = await prisma.user.findMany();

        // Préparation des données statistiques
        const statData: StatData = {
            totalUsers: users.length,
            // Ajoutez d'autres statistiques selon vos besoins
        };

        return {
            props: {
                statData,
            },
        };
    } catch (error) {
        console.error('Error fetching data:', error);

        // Retourner des valeurs par défaut en cas d'erreur
        return {
            props: {
                statData: {
                    totalUsers: 0,
                    // Ajoutez d'autres statistiques avec des valeurs par défaut si nécessaire
                },
            },
        };
    }
}

export default IndexPage;
