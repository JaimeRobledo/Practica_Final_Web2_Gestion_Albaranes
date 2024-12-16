'use client';
import React, { useState, useEffect } from 'react';
import EditProjectForm from '../../../components/editformproyecto';
import { useRouter, useSearchParams } from 'next/navigation';

function LoadingSpinner() {
    return <div className="text-center text-gray-500">Cargando...</div>;
}

export default function EditProjectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${projectId}`, {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch project data.');
                }
                return response.json();
            })
            .then((data) => {
                setProjectData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching project data:', error);
                setError(error.message);
                setLoading(false);
            });
        } else {
            setLoading(false);
            setError('No authentication token found.');
        }
    }, [projectId]);

    const handleFormSubmit = async (formData) => {
        const token = localStorage.getItem('jwt');
        try {
            //console.log(formData);
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectId}`, {
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
            setError(result.message || 'Error al editar el proyecto.');
        }
        } catch (error) {
            setError('Error de red o problema del servidor.');
        }
    };

    const handleClosePopup = () => {
        setShowConfirmation(false);
        router.push('/webprincipal/proyectos'); 
    };

    if (loading) {
        return <LoadingSpinner />;
    }
    
    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex-1 p-8">
            <EditProjectForm onSubmit={handleFormSubmit} initialData={projectData} initialClientId={clientId}/>
            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Proyecto editado con éxito</h2>
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
