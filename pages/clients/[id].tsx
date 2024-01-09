import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import {PrismaClient, User} from "@/prisma/generated/client";
import Head from 'next/head';
import Link from "next/link";


export interface GenericEntityFront extends User {
    [key: string]: any;
    name: string;
}

interface GenericPageProps {
    genericEntity: GenericEntityFront;
    entityConfig: {
        entityName: string;
        displayNameProperty: string; // Propriété à utiliser pour le titre, par exemple: 'username' ou 'title'
        excludedColumns: string[]; // Colonnes à exclure
        entityPath: string;
        // Ajouter d'autres configurations si nécessaire
    };
}


const GenericDetails: NextPage<GenericPageProps> = ({
                                                        genericEntity,
                                                        entityConfig = { entityName: '', displayNameProperty: '', excludedColumns: [], entityPath: '' }
                                                    }) => {
    if (!entityConfig) {
        return <div>Loading or Invalid Configuration...</div>;
    }

    const pageTitle = `Dashboard des ${entityConfig.entityName}`;

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
                <h1>Détails de l' {entityConfig.displayNameProperty.toString()}</h1>
                <p>Nom : {genericEntity.name}</p>
                <p>Email : {genericEntity.email}</p>
            </div>
            <div>
                <Link href={`/${entityConfig.entityName}/put/${genericEntity.id}`}>Modifier</Link>
            </div>

        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
     const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
    const genericEntity = await prisma.user.findUnique({
        where: {
        id: Number(id),
        },
    });
    const serializedEntity = {
        ...genericEntity,
        created_at: genericEntity?.created_at ? genericEntity?.created_at.toISOString() : genericEntity?.created_at,
        updated_at: genericEntity?.updated_at ? genericEntity?.updated_at.toISOString() : genericEntity?.updated_at,
        entityConfig: {
            entityName: 'user',
            displayNameProperty: 'Client',
            excludedColumns: ['password_hash'],
            entityPath: 'users',
        }
    };

  return {
    props: {
      genericEntity: serializedEntity,
    },
  };
}
export default GenericDetails;
