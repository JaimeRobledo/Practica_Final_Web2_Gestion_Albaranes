'use client';
import React, { useState, useEffect } from 'react';
import EditAlbaranForm from '../../../components/editformalbaran';
import { useRouter, useSearchParams } from 'next/navigation';

function LoadingSpinner() {
    return <div className="text-center text-gray-500">Cargando...</div>;
}

export default function EditAlbaranPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const albaranId = searchParams.get('albaranId');
    const projectId = searchParams.get('projectId');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [albaranData, setAlbaranData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${albaranId}`, {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch deliverynote data.');
                }
                return response.json();
            })
            .then((data) => {
                setAlbaranData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching deliverynote data:', error);
                setError(error.message);
                setLoading(false);
            });
        } else {
            setLoading(false);
            setError('No authentication token found.');
        }
    }, [albaranId]);

    const handleFormSubmit = async (formData) => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${albaranId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
              

        const result = await response.json();

        if (response.ok) {
            setShowConfirmation(true);
            setError(null);
        } else {
            console.error('API Error:', result);
            setError(result.message || 'Error al editar el albaran.');
        }
        } catch (error) {
            setError('Error de red o problema del servidor.');
        }
    };

    const handleClosePopup = () => {
        setShowConfirmation(false);
        router.push('/webprincipal/albaranes'); 
    };

    if (loading) {
        return <LoadingSpinner />;
    }
    
    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex-1 p-8">
            <EditAlbaranForm onSubmit={handleFormSubmit} initialData={albaranData} initialProjectId={projectId} />
            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Albaran editado con éxito</h2>
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
