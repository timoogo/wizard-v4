import React, { useState, useEffect } from "react";
import router from "next/router";
import Link from "next/link";
import Paginator from "@/librairy/components/Paginator";
import Head from "next/head";
import {ColumnSelection} from "@/librairy/types/ColumnSelection";
import {UserFront} from "@/librairy/interfaces/UserFront";
import prisma from "@/prisma/prisma";



interface UsersPageProps {
  users: UserFront[];
}

const excludedColumns = ["password_hash"];

const UsersPage = ({ users }: UsersPageProps) => {


  // Page title
  const pageTitle = "Dashboard des utilisateurs";

  // State for items per page and current page
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  // State for selected columns
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: boolean;
  }>(() => {


    // Initialize selectedColumns from local storage


    // If no saved columns, initialize with all columns
    const initialColumns: ColumnSelection = {};
    if (users.length > 0) {
      Object.keys(users[0]).forEach((key) => {
        initialColumns[key] = true; // Toutes les colonnes sont sélectionnées par défaut
      });
    }
    return initialColumns;
  });

  // State to control filter popup visibility
  const [showFilterPopup, setShowFilterPopup] = useState(false);


  // Function to render the filter popup
  const FilterPopup = () => (
      <div className="filter-popup bg-white shadow-lg rounded-lg p-4 w-full flex flex-col">
        {/* Flex layout for overall alignment */}
        {Object.keys(selectedColumns)
            .filter((key) => !excludedColumns.includes(key)) // Filtrez les clés à exclure
            .map((key) => (
                <div key={key} className="flex items-center mb-4">
                  {/* Flexbox layout for each filter item */}
                  <label className="flex-grow font-medium text-gray-700">
                    <input
                        type="checkbox"
                        className="mr-2 leading-tight"
                        checked={selectedColumns[key]}
                        onChange={(e) => {
                          setSelectedColumns((prev) => ({
                            ...prev,
                            [key]: e.target.checked,
                          }));
                        }}
                    />
                    {key}
                  </label>
                </div>
            ))}
        <div className="mt-auto flex justify-end">
          {/* Aligns the button to the bottom-right */}
          <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setShowFilterPopup(false);
              }}
          >
            Fermer
          </button>
        </div>
      </div>
  );


  // Function to render table headers based on selected columns
  const renderTableHeaders = () => (
      <tr>
        {Object.keys(selectedColumns).map(
            (key) => selectedColumns[key] && !excludedColumns.includes(key) && (
                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {key}
                </th>
            )
        )}
      </tr>
  );

// Function to render a table row based on selected columns
  const renderTableRow = (user: UserFront) => (
      <tr key={user.id}>
        {Object.keys(user).map(
            (key) =>
                selectedColumns[key] && !excludedColumns.includes(key) && (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {key === "username" ? (
                          <Link href={`/users/${user.id}`} className={"text-indigo-600 hover:text-indigo-900"}>{user[key]}</Link>
                      ) : (
                          user[key]
                      )}
                    </td>
                )
        )}
      </tr>
  );

  // Filter the current users based on selected columns
  const currentUsers = users.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  // Return the JSX content
  return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <div>
          {/* Button to show/hide filter popup */}
          <button className="mx-8 px-4 py-2" onClick={() => setShowFilterPopup(prev => !prev)}>
            Filtrer les Colonnes
          </button>
          {showFilterPopup && <FilterPopup />}
          {/* Table to display users */}
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              {renderTableHeaders()}
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {currentUsers.map((user) => renderTableRow(user))}
              </tbody>
            </table>
            <Paginator
                currentPage={currentPage}
                totalPages={Math.ceil(users.length / itemsPerPage)}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                items={currentUsers}
            />
          </div>


        </div>
      </>
  );
};

// Fetch users data from the server
export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  //@ts-ignore
  const serializedUsers = users.map((user) => ({
    ...user,
    created_at: user.created_at ? user.created_at.toISOString() : null,
    updated_at: user.updated_at ? user.updated_at.toISOString() : null,
  }));

  return { props: { users: serializedUsers } };
}

export default UsersPage;
