import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import {UserFront} from "@/librairy/interfaces/UserFront";

export type GenericEntityFormData = {
  [key: string]: string | boolean;
};

type GenericFormProps = {
  entityName: string;
  formFields: string[];
};

const GenericForm: React.FC<GenericFormProps> = ({ entityName, formFields }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<GenericEntityFormData>({});
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const initialFormData = formFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});
    setFormData(initialFormData);
    checkFormCompleteness();
  }, [formFields]);

  const checkFormCompleteness = () => {
    const isComplete = formFields.every(field => {
      const value = formData[field];
      return typeof value === 'string' && value.trim() !== '';
    });
    setIsFormComplete(isComplete);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const updatedValue = type === 'checkbox' ? e.target.checked.toString() : value;
    setFormData(prevState => ({
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
        console.log(await response.json());
        throw new Error(`Error creating ${entityName}`);
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
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <h1 className='ml-16 text-3xl font-bold mb-4'>Create a {entityName}</h1>
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
            <form onSubmit={handleSubmit} className="space-y-4">
              {formFields.map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    <input
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={formData[field].toString()}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
              ))}
              <div className="flex justify-end">
                <button type="submit" disabled={!isFormComplete} className={`px-6 py-2 rounded-md text-white transition duration-200 ease-in-out ${isFormComplete ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  
  const entityName = 'user';


  const entity = await prisma.user.findMany();

  if (entity.length === 0) {
    return { props: { entityName, formFields: [] } };
  }
  const formFields = Object.keys(entity[0]).filter(key => key !== 'id');

  return {
    props: {
      entityName,
      formFields,
    },
  };
};

export default GenericForm;
