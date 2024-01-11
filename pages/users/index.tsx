import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import * as fs from "fs";

import prisma from "@/prisma/prisma";
import { FilterPopup } from "@/librairy/components/FilterPopup";
import { TableContainer } from "@/librairy/components/TableContainer";
import Paginator from "@/librairy/components/Paginator";
import { ColumnSelection } from "@/librairy/types/ColumnSelection";
import { createModelType} from "@/librairy/utils/createModelType";
import { getLastFolderName} from "@/librairy/utils/getLastFolderName";
import { GenericPageProps} from "@/librairy/types/GenericProp";
import { init } from "@/librairy";
import capitalizeAndRemoveLast from "@/librairy/utils/capitalizeAndRemoveLast";
import {getCreateURLFor} from "@/helpers/routesHelpers";





const GenericPage: React.FC<GenericPageProps> = ({ genericEntities, entityConfig, modelEntity }) => {
  const pageTitle = `${entityConfig.entityName}'s Dashboard`;
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
                modelEntity={modelEntity}/>
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
              href={getCreateURLFor(entityConfig.entityName)}>Create a {entityConfig.entityName}</Link>
        </div>
      </>
  );
};
export async function getServerSideProps() {
  const currentFolder = getLastFolderName(path.dirname(new URL(import.meta.url).pathname));
  const jsonModelData =init(currentFolder);
  const entityName = capitalizeAndRemoveLast(currentFolder)
  // @ts-ignore
  const arrCurrentFolder = [...currentFolder]
  arrCurrentFolder.pop()
  const tableName = arrCurrentFolder.join('')
  // // 6. Création d'un modèle à partir des données JSON pour une entité spécifique ("Clients" dans ce cas).
   const modelEntity = createModelType(entityName, jsonModelData);

  //

  try {
    // @ts-ignore
    
    const genericEntities = await (prisma[tableName] as unknown as any).findMany();
    // 8. Interrogation de la base de données pour récupérer toutes les entités 'user'.

    // 9. Configuration de l'entité, spécifiant le nom de l'entité, la propriété à afficher et les colonnes à exclure.
    const entityConfig = {
      entityName: currentFolder,
      displayNameProperty: entityName,
      excludedColumns: ["password_hash"],
    };

    // 11. Retour des données transformées et de la configuration de l'entité en tant que props pour le composant.
    return  { props: { genericEntities, modelEntity, entityConfig } };
  } catch (error) {
    // 12. Gestion des erreurs potentielles lors de l'interrogation de la base de données.
    console.error(error);

    return { props: { genericEntities: [], modelEntity:{}, entityConfig: null } };
  } finally {
    // 13. Déconnexion de Prisma pour éviter les fuites de connexion.
    await prisma.$disconnect();
  }
}

export default GenericPage;
