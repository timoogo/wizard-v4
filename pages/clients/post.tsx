  import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
  import { useRouter } from 'next/router';
  import { GetServerSideProps } from 'next';
  import path from 'path';
  import * as fs from 'fs';
  import { JsonModelData } from '@/librairy/interfaces/GenericModel';
  import { createModelType } from '@/librairy/utils/createModelType';
  import { AvailableEntity } from '@/librairy/types/AvailableEntity';
  import {GenericCheckbox} from "@/librairy/components/Form/GenericCheckbox";
  import {GenericInputNumber} from "@/librairy/components/Form/GenericInputNumber";
  import {GenericInputText} from "@/librairy/components/Form/GenericInputText";

  type GenericFormProps = {
    entityName: string;
    formFields: string[];
    formFieldsTypes: Record<string, string>;
  };

  type GenericEntityFormData = {
    [key: string]: string | number | boolean;
  };

  const GenericFormPage: React.FC<GenericFormProps> = ({ entityName, formFields, formFieldsTypes }) => {
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
        const response = await fetch(`/api/${entityName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error(`Error creating ${entityName}:`, errorResponse);
          return;
        }

        await router.push(`/success-page-for-${entityName}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error creating ${entityName}: ${error.message}`);
        } else {
          console.error(`An unexpected error occurred.`);
        }
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
                          value={formData[field] as number}
                          handleChange={handleChange}

                      />
                  )}
                </div>
            ))}
            <div className="flex items-center justify-between">
              <button
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
    const entityName: AvailableEntity = "Example";

    // Génération du modèle à partir des données JSON
    const modelEntity = createModelType(entityName, jsonModelData);

    let formFields: string[] = [];
    let formFieldsTypes: Record<string, string> = {};

    if (modelEntity) {
      // Filtrage des champs de formulaire basé sur le type des propriétés (par exemple, type 'string', 'integer' ou 'boolean')
      formFields = Object.keys(modelEntity);
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
      },
    };
  };


  export default GenericFormPage;
