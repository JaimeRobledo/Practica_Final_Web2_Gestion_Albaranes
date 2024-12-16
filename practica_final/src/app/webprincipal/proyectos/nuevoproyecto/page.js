'use client';
import React, { useState } from 'react';
import NewProjectForm from '../../../components/formproyecto';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setShowConfirmation(true);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message || 'Error al crear el proyecto.');
      }
    } catch (error) {
      setErrorMessage('Error de red o problema del servidor.');
    }
  };

  const handleClosePopup = () => {
    setShowConfirmation(false);
    router.push('/webprincipal/proyectos'); 
  };

  return (
    <div className="flex-1 p-8">
        {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
        <NewProjectForm onSubmit={handleFormSubmit} initialClientId={clientId}/>
        {showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Proyecto creado con éxito</h2>
                <button
                onClick={handleClosePopup}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                Cerrar
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
