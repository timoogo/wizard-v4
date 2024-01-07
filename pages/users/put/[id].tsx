import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import { API_ROUTES } from '@/constants/api.routes.constants';
import {PrismaClient} from "@/prisma/generated/client";

interface EditUserProps {
    user: UserData;
}
type UserData = {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    created_at: string | null;
}

const EditUserPage: NextPage<EditUserProps> = ({ user }) => {
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    // Autres champs...

    const router = useRouter();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await fetch(`${API_ROUTES.USERS}/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email }),
            });

            if (!res.ok) {
                throw new Error('Erreur lors de la mise à jour de l’utilisateur');
            }

            router.push(`/users/${user.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <h1>Modifier l'Utilisateur</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password_hash">Mot de passe</label>
                    <input
                        id="password_hash"
                        name="password_hash"
                        type="password"
                        value={user.password_hash}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="created_at">Date de création</label>
                    <input
                        id="created_at"
                        name="created_at"
                        type="text"
                        value={user.created_at}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <button type="submit">Mettre à jour</button>
            </form>
        </>
    );
};

export default EditUserPage;

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
    };

    return {
        props: {
            user: serializedUser,
        },
    };
}
