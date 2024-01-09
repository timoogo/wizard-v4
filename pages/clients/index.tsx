import {createModelType} from "@/librairy/utils/reader";

const entityName = 'users';

import React, { useState } from "react";
import Head from "next/head";
import { User } from "@/prisma/generated/client";
import { FilterPopup } from "@/librairy/components/FilterPopup";
import { TableContainer } from "@/librairy/components/TableContainer";
import Paginator from "@/librairy/components/Paginator";
import { ColumnSelection } from "@/librairy/types/ColumnSelection";
import {useTransformDate} from "@/librairy/hooks/useTransformDate";
import { DateAndTimeFormatEnum, DateFormatEnum } from "@/librairy/types/DateFormat";
import Link from "next/link";
import {GenericEntityFront, JsonModelData} from "@/librairy/interfaces/GenericModel";
import path from "path";
import * as fs from "fs";
import {getLastFolderName} from "@/librairy/utils/getLastFolderName";



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
};export async function getServerSideProps() {
  // 1. Combinaison du chemin actuel de travail avec un chemin relatif pour obtenir le chemin complet du fichier JSON.
  const jsonFilePath = path.join(process.cwd(), 'prisma/generated/json/json-schema.json');

  // 2. Obtention du chemin complet du répertoire contenant le fichier actuellement exécuté.
  const currentFullPath = path.dirname(new URL(import.meta.url).pathname);

  // 3. Utilisation d'une fonction utilitaire pour extraire le nom du dernier dossier à partir du chemin complet.
  const currentDir = getLastFolderName(currentFullPath);

  // 4. Lecture du contenu du fichier JSON spécifié et stockage du contenu sous forme de chaîne de caractères.
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8');

  // 5. Transformation de la chaîne JSON en un objet JavaScript.
  const jsonModelData: JsonModelData = JSON.parse(jsonData);

  // 6. Création d'un modèle à partir des données JSON pour une entité spécifique ("Clients" dans ce cas).
  const modelEntity = createModelType("User", jsonModelData);

  // 7. Affichage dans la console du nom du dernier dossier et de l'entité modèle générée.
  console.log(currentDir, modelEntity);

  try {
    // 8. Interrogation de la base de données pour récupérer toutes les entités 'user'.
    const genericEntities = await prisma.user.findMany();

    // 9. Configuration de l'entité, spécifiant le nom de l'entité, la propriété à afficher et les colonnes à exclure.
    const entityConfig = {
      entityName: "users",
      displayNameProperty: "username",
      excludedColumns: ["password_hash"],
    };

    // 10. Transformation des entités récupérées pour formater les dates et exclure les colonnes spécifiées.
    const serializedEntities = genericEntities.map((genericEntity) => ({
      ...genericEntity,
      created_at: genericEntity.created_at ? useTransformDate(genericEntity.created_at, DateFormatEnum.dayMonthYear) : null,
      updated_at: genericEntity.updated_at ? useTransformDate(genericEntity.updated_at, DateAndTimeFormatEnum.dayMonthYearHourMinuteSecond) : null
    }));

    // 11. Retour des données transformées et de la configuration de l'entité en tant que props pour le composant.
    return { props: { genericEntities: serializedEntities, entityConfig } };
  } catch (error) {
    // 12. Gestion des erreurs potentielles lors de l'interrogation de la base de données.
    console.error(error);
    return { props: { genericEntities: [], entityConfig: null } };
  } finally {
    // 13. Déconnexion de Prisma pour éviter les fuites de connexion.
    await prisma.$disconnect();
  }
}

export default GenericPage;
