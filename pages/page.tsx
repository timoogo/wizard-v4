import StatCard from '@/librairy/components/StatCard';
import React from 'react';
import { FaUser, FaTags, FaCalendar, FaBuilding } from 'react-icons/fa';
import {PrismaClient} from "@prisma/client";

interface StatData {
  totalUsers: number; // Add other statistics as needed
}

const IndexPage = ({ statData }: { statData: StatData }) => {

  return (
      <div className="bg-gray-200 p-4 min-h-screen">
        <div className="flex flex-col py-2">
          <h1 className="text-6xl py-2 ">Dashboard ggg</h1>
          <div className="flex flex-row flex-wrap">
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

  );
  };

export async function getServerSideProps() {
  try {
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });

    // Récupération des données des utilisateurs
    const users = await prisma.user.findMany();

    // Sérialisation des utilisateurs
    const serializedUsers = users.map((user: any) => ({
      ...user,
    }));

    // Préparation des données supplémentaires (autres requêtes ou calculs)
    // Exemple: const additionalData = await someOtherDataFetchingFunction();

    return {
      props: {
        users: serializedUsers,
        // Ajouter d'autres données ici: additionalData,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        users: [],
        // Initialiser d'autres données ici si nécessaire: additionalData: defaultValue,
      },
    };
  }
}

export default IndexPage;
