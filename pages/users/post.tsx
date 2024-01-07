import {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import {randomInt, randomUUID} from "crypto";


export type UserFormData = {
  username: string;
  email: string;
  password_hash: string;
    id?: string;
};

const UserForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password_hash: '',
      id: ''
  });
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    checkFormCompleteness();
  } , [formData]);

  const checkFormCompleteness = () => {
    const isUsernameComplete = formData.username.trim() !== '';
    const isEmailComplete = formData.email.trim() !== '';
    const isPasswordComplete = formData.password_hash.trim() !== '';

    setIsFormComplete(isUsernameComplete && isEmailComplete && isPasswordComplete);
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    setFormData(prevState => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const userData = {
      username: formData.username,
      email: formData.email,
      password_hash: formData.password_hash , // Change this line if your backend expects a plain password
    };

    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error('Error creating user');
      }

      router.push('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error creating user: ${error.message}`);
      } else {
        console.error(`An unexpected error occurred.`);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <h1 className='ml-16 text-3xl font-bold mb-4'>Create a User</h1>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username:</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password:</label>
              <input type="password" name="password_hash" value={formData.password_hash} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={!isFormComplete} className={`px-6 py-2 rounded-md text-white transition duration-200 ease-in-out ${isFormComplete ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
