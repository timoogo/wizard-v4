import React, { useState } from "react";
import router from "next/router";

import { PrismaClient } from '@/prisma/generated/client'

import Link from "next/link";
import Paginator from "@/components/Paginator";
import {User} from "@/prisma/generated/client";
import {GetServerSideProps} from "next";
import {Props} from "next/script";
import Head from "next/head";
// import { PencilIcon, XCircleIcon } from '@heroicons/react/16/solid';

interface ExtendedUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string | null; // Mettre à jour le type ici
}
interface UsersPageProps {
  users: ExtendedUser[];
}



const UsersPage = ({ users }: UsersPageProps) => {
    const pageTitle = 'Dashboard des utilisateurs';

  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log(currentUsers)
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
  };
  const renderTableHeaders = () => {
    const usersKeys = ['id', 'name', 'email', 'created_at', /* add other fields */];
    return (
      <tr className="border-b border-gray-200 text-center">
        {usersKeys.map((key) => (
          <th
            className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider align-middle"
            key={key}
          >
            {key}
          </th>
        ))}
        <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
          Actions
        </th>
      </tr>
    );
  };
  const dateFormater = (date: string) => {
    const dateObject = new Date(date);
    return `${dateObject.toLocaleDateString()} ${dateObject.toLocaleTimeString()}`;
  }
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // const options = (userId: number): DropdownOption[] => [
  //   // @ts-ignore
  //   {
  //     text: 'Modifier',
  //     Icon: PencilAltIcon,
  //     color: '#3490dc',
  //     action: () => handleEdit(userId),
  //   },
  //   {
  //     text: 'Supprimer',
  //     Icon: XCircleIcon,
  //     color: '#e3342f',
  //     action: () => handleDelete(userId),
  //   },
  // ];

  const handleView = (userId: number) => {
    router.push(`/users/${userId}`); // Change the route accordingly
  }

  const handleEdit = (userId: number) => {
    router.push(`/users/put/${userId}`); // Change the route accordingly
  };

  const handleDelete = async (userId: number) => {
    try {
      // Assurez-vous que l'URL est correcte et qu'il n'y a pas d'espaces
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('User deleted');
        router.reload();
      } else {
        console.error('Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };




  return (
      <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
    <div>
      <div className="flex justify-end">
      <Link
          href="/users/post"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Créer un user
        </Link>
      </div>
      {currentUsers.length === 0 ? (
        <div className='flex justify-center mt-5'>
          <p className="text-gray-500 text-lg">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {renderTableHeaders()}
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-center align-middle">{user.id}</td>
                  <td className="px-6 py-4  text-center align-middle">{user.username}</td>
                  <td className="px-6 py-4 text-center align-middle">{user.email}</td>
                  {/* Render other user data fields similarly */}
                  <td className="px-6 py-4 text-center align-middle">
                    {user.created_at ? dateFormater(user.created_at) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                      <button onClick={() => handleView(user.id)} className="mr-2">
                        Voir
                      </button>
                      <button onClick={() => handleEdit(user.id)} className="mr-2">
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(user.id)}>
                        Supprimer
                      </button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
                    <Paginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        items={currentUsers}
                    />
         
          </div>
        </div>
      )}
    </div>
        </>
  );
  
  
};
export async function getServerSideProps() {
  try {
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    const users = await prisma.user.findMany();
    console.log({users})

    const serializedUsers = users.map((user:any) => {
      return {
        ...user,
        // Vérifiez si created_at existe et convertissez-le, sinon laissez-le tel quel
        created_at: user.created_at ? user.created_at.toISOString() : user.created_at,
      };
    });
    // Convertir les dates en chaînes de caractères formatées JSON

    return {
      props: {
        users: serializedUsers,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        users: [],
      },
    };
  }
}

export default UsersPage;


