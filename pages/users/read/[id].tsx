import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Link from "next/link";

import { GenericPageProps } from "@/librairy/types/GenericProp";

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

    const genericEntity = await prisma.user.findUnique({
        where: {
        id: Number(id),
        },
    });

  return {
    props: {
      genericEntity: genericEntity,
    },
  };
}
export default GenericDetails;
