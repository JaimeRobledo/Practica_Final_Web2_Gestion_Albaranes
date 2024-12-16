'use client';
import React, { useState } from 'react';
import NewClientForm from '../../../components/formcliente';
import { useRouter } from 'next/navigation';

export default function NewClientPage() {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
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
        setErrorMessage(result.message || 'Error al crear el cliente.');
      }
    } catch (error) {
      setErrorMessage('Error de red o problema del servidor.');
    }
  };

  const handleClosePopup = () => {
    setShowConfirmation(false);
    router.push('/webprincipal/clients'); 
  };

  return (
    <div className="flex-1 p-8">
      <NewClientForm onSubmit={handleFormSubmit} />
      {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Cliente creado con éxito</h2>
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
