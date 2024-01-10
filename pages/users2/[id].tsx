import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import {PrismaClient} from "@/prisma/generated/client";
import Head from 'next/head';
import Link from "next/link"
import {UserFront} from "@/librairy/interfaces/UserFront";

export interface UserDetailsProps {
  user: UserFront | null;
}

const UserDetails: NextPage<UserDetailsProps> = ({ user }) => {
  const pageTitle = user ? `Détails de ${user.username}` : "Utilisateur introuvable";

  if (!user) {
    return <div>Utilisateur introuvable</div>;
  }

  return (<>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div>
        <h1>Détails de l utilisateur</h1>
        <p>Nom : {user.username}</p>
        <p>Email : {user.email}</p>
      </div>


          {/* Link pour modifier /users/edit/{id} */}
          <Link href={`/users/put/${user.id}`}>Modifier</Link>

    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
     const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
    const user = await prisma.user.findUnique({
        where: {
        id: Number(id),
        },
    });
    const serializedUser = {
        ...user,
        created_at: user?.created_at ? user?.created_at.toISOString() : user?.created_at,
        updated_at: user?.updated_at ? user?.updated_at.toISOString() : user?.updated_at,
    };

  return {
    props: {
      user: serializedUser,
    },
  };
}
export default UserDetails;
