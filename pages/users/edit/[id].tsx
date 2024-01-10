import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import {PrismaClient} from "@/prisma/generated/client";
import {UserFront} from "@/librairy/interfaces/UserFront";
import {API_ROUTES} from "@/librairy/constants/api.routes.constants";
// import reader prisma/reader

interface EditUserProps {
    user: UserFront;
}

const EditUserPage: NextPage<EditUserProps> = ({ user }) => {
    const [formData, setFormData] = useState(user);
    const router = useRouter();

    // Liste des champs non modifiables
    const nonEditableFields = ['id','password_hash','created_at', 'updated_at'];

    // Gestionnaire de changement pour les champs modifiables
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    // Gestionnaire de soumission du formulaire
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Filtrer les champs non modifiables
        const dataToUpdate = Object.keys(formData).reduce((acc: any, key) => {
            if (!nonEditableFields.includes(key)) {
                acc[key] = formData[key];
            }
            return acc;
        }, {});

        try {
            const res = await fetch(`${API_ROUTES.USERS}/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
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
                {Object.keys(formData).map((key) => {
                    if (nonEditableFields.includes(key) || key === 'password_hash') {
                        // Exclure le champ password_hash et les champs non modifiables du rendu
                        return null;
                    } else {
                        // Rendre les champs modifiables
                        return (
                            <div key={key}>
                                <label htmlFor={key}>{key}</label>
                                <input
                                    id={key}
                                    name={key}
                                    type="text"
                                    value={formData[key]}
                                    onChange={handleChange}
                                />
                            </div>
                        );
                    }
                })}
                <button type="submit">Mettre à jour</button>
            </form>
        </>
    );
};
export default EditUserPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    // reader prisma
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
