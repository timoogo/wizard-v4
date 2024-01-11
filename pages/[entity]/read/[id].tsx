import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Link from "next/link";

import { GenericPageProps } from "@/librairy/types/GenericProp";
import capitalizeAndRemoveLast from "@/librairy/utils/capitalizeAndRemoveLast";
import { getModelDefinition} from "@/librairy/utils/getModelDefinition";
import { init } from "@/librairy";
import prisma from "@/prisma/prisma";

const GenericDetails: NextPage<GenericPageProps> = ({
  genericEntity,
  entityConfig,
  modelEntity,
}) => {
  if (!entityConfig) {
    return <div>Loading or Invalid Configuration...</div>;
  }

  const pageTitle = `${entityConfig.entityName}'s Dashboard`;

  if (!genericEntity) {
    return <div>{entityConfig.entityName} introuvable</div>;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <h1>{entityConfig.displayNameProperty.toString()}</h1>
        {Object.keys(modelEntity).map(key => {
          return (<>
            <p>{key} : {genericEntity[key]}</p>
          </>);
        })}
      </div>
      <div>
        <Link href={`/${entityConfig.entityName}/edit/${genericEntity.id}`}>Edit</Link>
      </div>
    </>
  );
};

type ServerSideProps = {
  params: {
    id: string;
    entity: string;    
  }
}

export async function getServerSideProps(params: ServerSideProps) {
  const { id, entity } = params.params;
  // @ts-ignore
  const arrEntity = [...entity];
  arrEntity.pop()
  const tableName = arrEntity.join('')

  const displayName = capitalizeAndRemoveLast(entity);

  const jsonModelData = init();
  const modelEntity = getModelDefinition(displayName, jsonModelData);
  console.log('modelEntity', modelEntity);

  // @ts-ignore
  const genericEntity = await prisma[tableName].findUnique({
    where: {
      id: Number(id),
    },
  });

  return {
    props: {
      genericEntity: genericEntity,
      entityConfig: {
        entityName: tableName,
        displayNameProperty: displayName,
        excludedColumns: [],
        entityPath: entity
      },
      modelEntity
    },
  };
}

export default GenericDetails;
