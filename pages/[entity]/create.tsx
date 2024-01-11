import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import path from 'path';
import * as fs from 'fs';
import { JsonModelData } from '@/librairy/interfaces/GenericModel';
import { getModelDefinition } from '@/librairy/utils/getModelDefinition';
import { AvailableEntity } from '@/librairy/types/AvailableEntity';
import {GenericCheckbox} from "@/librairy/components/Form/GenericCheckbox";
import {GenericInputNumber} from "@/librairy/components/Form/GenericInputNumber";
import {GenericInputText} from "@/librairy/components/Form/GenericInputText";
import {API_ROUTES} from "@/librairy/constants/api.routes.constants";
import pluralize from "pluralize";

type GenericFormProps = {
  entityName: string;
  formFields: string[];
  formFieldsTypes: Record<string, string>;
  excludeFields?: string[];
};

type GenericEntityFormData = {
  [key: string]: string | number | boolean;
};

const GenericFormPage: React.FC<GenericFormProps> = ({ entityName, formFields, formFieldsTypes, excludeFields }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<GenericEntityFormData>({});
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const initialFormData = formFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});
    setFormData(initialFormData);
  }, [formFields]);

  useEffect(() => {
    checkFormCompleteness();
  }, [formData]);

  const checkFormCompleteness = () => {
    const isComplete = formFields.every((field) => {
      if (formFieldsTypes[field] === 'boolean') {
        return formData[field] !== undefined;
      }
      return formData[field] && formData[field].toString().trim() !== '';
    });
    setIsFormComplete(isComplete);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    let updatedValue: string | number | boolean;

    if (type === 'checkbox') {
      updatedValue = checked;
    } else if (formFieldsTypes[name] === 'integer') {
      updatedValue = value !== '' ? parseInt(value, 10) : '';
    } else {
      updatedValue = value;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const entityNamePlural = pluralize(entityName.toLowerCase());
      const data = {
        ...formData,
      }
      const response = await fetch(`${API_ROUTES.USERS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Aceppt-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
        body: JSON.stringify(formData) // formData est l'état local avec les données du formulaire
      });
      if (!response.ok) {
      console.log('response', response)
        throw new Error('Erreur lors de la soumission du formulaire');
      }

      // Gérer la réponse, par exemple en redirigeant l'utilisateur
      console.log('Entité créée avec succès:', await response.json());
      // Redirection ou mise à jour de l'état ici
    } catch (error) {
        // Gérer les erreurs ici
        console.error(error);
    }
  };


  return (
      <div className="container mx-auto px-4">
        <h1 className="text-xl font-semibold mb-4">Create {entityName}</h1>
        <pre className="bg-gray-800 text-white overflow-x-auto p-4 rounded-lg">
          <code className="language-json">{JSON.stringify(formFieldsTypes, null, 2)}</code>
        </pre>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {formFields.map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {formFieldsTypes[field] === 'boolean' && (
                    <GenericCheckbox
                        field={field}
                        checked={Boolean(formData[field])}
                        handleChange={handleChange}
                        labelData={{
                          label: field.charAt(0).toUpperCase() + field.slice(1),
                          labelColor: "gray-700",
                        }}
                    />
                )}
                {formFieldsTypes[field] === 'integer' && (
                    <GenericInputNumber
                        field={field}
                        value={String(formData[field])}
                        handleChange={handleChange}
                    />
                )}
                {formFieldsTypes[field] === 'string' && (
                    <GenericInputText
                        field={field}
                        value={formData[field] as string  }
                        handleChange={handleChange}

                    />
                )}
              </div>
          ))}
          <div className="flex items-center justify-between">
            <button
                onClick={() => router.back()}
                type="submit"
                disabled={!isFormComplete}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>

      </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Chemin vers le fichier JSON du schéma Prisma
  const filePath = path.join(process.cwd(), 'prisma/generated/json/json-schema.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const jsonModelData: JsonModelData = JSON.parse(jsonData);

  // Déterminez l'entité à utiliser ici. Pour l'exemple, je vais utiliser 'User'
  const entityName: AvailableEntity = "User";

  // Génération du modèle à partir des données JSON
  const modelEntity = getModelDefinition(entityName, jsonModelData);

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


export default GenericFormPage;
