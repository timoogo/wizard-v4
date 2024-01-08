import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import {PrismaClient} from "@/prisma/generated/client";
import {API_ROUTES} from "@/constants/api.routes.constants";
import {UserFront} from "@/pages/users/index";
import Head from 'next/head';
import Link from "next/link";


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


          {/* Link pour modifier /users/put/{id} */}
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
