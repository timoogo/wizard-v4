import React from 'react';
import { FaUser } from 'react-icons/fa';
import StatCard from '@/components/StatCard';
import { PrismaClient } from '@/prisma/generated/client'
import Head from "next/head";
import Header from "@/components/Header";

interface StatData {
    totalUsers: number;
    // Ajoutez d'autres statistiques selon vos besoins
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
                        title="Total Users"
                        value={`${statData.totalUsers}`}
                        description="Total Users"
                        icon={<FaUser />}
                        redirection='/users'
                        accessibilityLabel='Total Users'
                    />
                    {/* Ajoutez plus de composants StatCard pour d'autres statistiques */}
                </div>
            </div>
        </div>
        </>
    );
};

export async function getServerSideProps() {
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
