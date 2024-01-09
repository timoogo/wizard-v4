import React, { useState } from "react";
import Head from "next/head";
import { PrismaClient, User } from "@/prisma/generated/client";
import { FilterPopup } from "@/librairy/components/FilterPopup";
import { TableContainer } from "@/librairy/components/TableContainer";
import Paginator from "@/librairy/components/Paginator";
import { ColumnSelection } from "@/librairy/types/ColumnSelection";
import {useTransformDate} from "@/librairy/hooks/useTransformDate";
import {DateAndTimeFormatEnum, DateFormatEnum} from "@/librairy/types/DateFormat";
import Link from "next/link";

export interface GenericEntityFront extends User {
  [key: string]: any;
  name: string;
}

interface GenericPageProps {
  genericEntities: GenericEntityFront[];
  entityConfig: {
    entityName: string; // Par exemple: 'user' ou 'book'
    displayNameProperty: string; // Propriété à utiliser pour le titre, par exemple: 'username' ou 'title'
    excludedColumns: string[]; // Colonnes à exclure
    // Ajouter d'autres configurations si nécessaire
  };
}

const GenericPage: React.FC<GenericPageProps> = ({ genericEntities, entityConfig }) => {
  const pageTitle = `Dashboard des ${entityConfig.entityName}`;
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const handleColumnChange = (column: string, value: boolean) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: value,
    }));
  };
  // Initialize selectedColumns from local storage or with all columns selected by default
  const excludedColumns = ["password_hash"];
  const [selectedColumns, setSelectedColumns] = useState<ColumnSelection>(() => {
    const initialColumns: ColumnSelection = {};
    if (genericEntities.length > 0) {
      Object.keys(genericEntities[0]).forEach((key) => {
        initialColumns[key] = true; // All columns are selected by default
      });
    }
    return initialColumns;
  });

  const currentEntities = genericEntities.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <div className="container mx-auto">
          <button onClick={() => setShowFilterPopup(!showFilterPopup)}>Filtrer les Colonnes</button>
          {showFilterPopup && (
              <FilterPopup
                    excludedColumns={excludedColumns}
                  selectedColumns={selectedColumns}
                  onChange={handleColumnChange}
                    onClose={() => setShowFilterPopup(false)}

              />
          )}
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <TableContainer
                data={genericEntities}
                selectedColumns={selectedColumns}
                entityPath={entityConfig.entityName} // Nom de l'entité
                excludedColumns={excludedColumns}
            />
          </div>
          <Paginator
              currentPage={currentPage}
              totalPages={Math.ceil(genericEntities.length / itemsPerPage)}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              items={currentEntities}
          />

          <Link
              className="px-6 py-2 rounded-md text-white transition duration-200 ease-in-out bg-blue-600 hover:bg-blue-700"
              href={`/${entityConfig.entityName}/post`}>Create a {entityConfig.entityName}</Link>
        </div>
      </>
  );
};
export async function getServerSideProps() {
  
  try {
    const genericEntities = await prisma.user.findMany();
    const entityConfig = {
      entityName: "users",
      displayNameProperty: "username",
      excludedColumns: ["password_hash"],
    };

    const serializedEntities = genericEntities.map((genericEntity) => ({
      ...genericEntity,
      created_at: genericEntity.created_at ? useTransformDate(genericEntity.created_at, DateFormatEnum.dayMonthYear) : null,
      updated_at: genericEntity.updated_at ? useTransformDate(genericEntity.updated_at, DateAndTimeFormatEnum.dayMonthYearHourMinuteSecond) : null
    }));

    return { props: { genericEntities: serializedEntities, entityConfig } };
  } catch (error) {
    console.error(error);
    return { props: { genericEntities: [], entityConfig: null } };
  } finally {
    await prisma.$disconnect();
  }
}

export default GenericPage;
