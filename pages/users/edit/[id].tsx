import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import {PrismaClient} from "@/prisma/generated/client";
import {UserFront} from "@/librairy/interfaces/UserFront";
import {API_ROUTES} from "@/librairy/constants/api.routes.constants";
import {getEditURLFor} from "@/helpers/routesHelpers";
import {headers} from "next/headers";
import {getLastFolderName} from "@/librairy/utils/getLastFolderName";
import path from "path";
import {init} from "@/librairy";
import capitalizeAndRemoveLast from "@/librairy/utils/capitalizeAndRemoveLast";
import {GenericPageProps} from "@/librairy/types/GenericProp";
import {createModelType} from "@/librairy/utils/createModelType";
import fs from "fs";
import {JsonModelData} from "@/librairy/interfaces/GenericModel";
import {AvailableEntity} from "@/librairy/types/AvailableEntity";
// import reader prisma/reader

const GenericEditPage: NextPage<GenericPageProps> = ({ entity, genericEntity, nonEditableFields }) => {
    const [formData, setFormData] = useState(entity);
    const router = useRouter();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const dataToUpdate = Object.keys(formData).reduce((acc, key) => {
            if (!nonEditableFields.includes(key)) {
                // @ts-ignore
                acc[key] = formData[key];
            }
            return acc;
        }, {});

        try {
            const res = await fetch(getEditURLFor(entity.genericEntity.toString(), entity.id ), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (res.ok) {
                router.push(`/${entity.type}/${entity.id}`);
            } else {
                console.error('Failed to update the entity:', res.statusText);
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    return (
        <>
            <h1>Modifier {entity.genericEntity}</h1>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map(key => {
                    if (nonEditableFields.includes(key)) return null;
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
                })}
                <button type="submit">Mettre à jour</button>
            </form>
        </>
    );
};
export default GenericEditPage;
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    // Chemin vers le fichier JSON du schéma Prisma
    const filePath = path.join(process.cwd(), 'prisma/generated/json/json-schema.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const jsonModelData: JsonModelData = JSON.parse(jsonData);

    // Déterminez l'entité à utiliser ici. Pour l'exemple, je vais utiliser 'User'
    const entityName: AvailableEntity = "User";

    // Génération du modèle à partir des données JSON
    const modelEntity = createModelType(entityName, jsonModelData);

    let formFields: string[] = [];
    let formFieldsTypes: Record<string, string> = {};

    if (modelEntity) {
        // Filtrage des champs de formulaire basé sur le type des propriétés (par exemple, type 'string', 'integer' ou 'boolean')
        let excludeFields = ['id', 'created_at', 'updated_at'];
        // si un field dans excludedFields n'existe pas, on le ski
        formFields = Object.keys(modelEntity).filter((field) => !excludeFields.includes(field));
        formFieldsTypes = formFields.reduce((acc, field) => {
            let fieldType = '';

            if (modelEntity[field].type.includes('string')) {
                fieldType = 'string';
            } else if (modelEntity[field].type.includes('integer')) {
                fieldType = 'integer';
            } else if (modelEntity[field].type.includes('boolean')) {
                fieldType = 'boolean';
            }

            return { ...acc, [field]: fieldType };
        }, {});
    }

    return {
        props: {
            entityName,
            formFields,
            formFieldsTypes,
            excludeFields: ['id', 'created_at', 'updated_at'],
        },
    };
};