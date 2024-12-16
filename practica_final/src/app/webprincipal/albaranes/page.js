'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FotoAlbaranes from '../../images/albaranes.png';

function AlbaranItem({ project, albaran, onSelect, onDelete, onEdit, onDownloadPDF }) {
    return (
        <tr className="bg-white hover:bg-gray-100 cursor-pointer" onClick={() => onSelect(albaran)}>
            <td className="p-4 text-left">{albaran.projectId.name}</td>
            <td className="p-4 text-left">{albaran.format}</td>
            <td className="p-4 text-left">{albaran.material}</td>
            <td className="p-4 text-left">{albaran.hours}</td>
            <td className="p-4 text-left">{albaran.description}</td>
            <td className="p-4 text-left">{albaran.workdate}</td>
            <td className="p-4 text-left">
                <div className="flex space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(albaran); }} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">Editar</button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(albaran._id); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300">Eliminar</button>
                    <button onClick={(e) => { e.stopPropagation(); onDownloadPDF(albaran._id); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-600 transition duration-300">Descargar PDF</button>    
                </div>
            </td>
        </tr>
    );
}

function EmptyState({ onCreate }) {
    return (
        <div className="text-center">
            <img src={FotoAlbaranes.src} alt="Create Project" className="w-128 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Crea tu primer Albaran</h2>
            <p className="text-gray-500 mt-2">Para poder generar Albaranes digitales</p>
            <button onClick={onCreate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                ¡Sí, vamos!
            </button>
        </div>
    );
}

function LoadingSpinner() {
    return <div className="text-center text-gray-500">Cargando...</div>;
}

export default function Projects() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [albaranes, setAlbaranes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAlbaran, setSelectedAlbaran] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clients, setClients] = useState([]);
  

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch deliverynote.');
                }
                return response.json();
            })
            .then((data) => {
                setAlbaranes(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching deliverynotes:', error);
                setError(error.message);
                setLoading(false);
            });
        } else {
            setLoading(false);
            setError('No authentication token found.');
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
        fetch('https://bildy-rpmaya.koyeb.app/api/project', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch projects.');
                }
                return response.json();
            })
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching projects:', error);
                setError(error.message);
                setLoading(false);
            });
        } else {
            setLoading(false);
            setError('No authentication token found.');
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
        fetch('https://bildy-rpmaya.koyeb.app/api/client', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch clients.');
                }
                return response.json();
            })
            .then((data) => {
                setClients(data);
            })
            .catch((error) => {
                console.error('Error fetching clients:', error);
                setError(error.message);
            });
        }
    }, []);

  

    const handleCreateAlbaran = () => {
        if (projects.length === 0) {
            setError('Primero tienes que crear un proyecto.');
        return;
        }
        router.push('/webprincipal/albaranes/nuevoalbaran');
    };

    const handleDeleteAlbaran = (albaranId) => {
        const token = localStorage.getItem('jwt');
        fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${albaranId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to delete deliverynote.');
            }
            setAlbaranes(albaranes.filter(albaran => albaran._id !== albaranId));
        })
        .catch((error) => {
            console.error('Error deleting deliverynote:', error);
            setError(error.message);
        });
    };

    const handleSelectClient = (clientId) => {
        const client = clients.find(client => client._id === clientId);
        setSelectedClient(client);
    };

  const handleEditAlbaran = (albaran) => {
    const project = projects.find(project => project._id === albaran.projectId._id);
    router.push(`/webprincipal/albaranes/editalbaran?albaranId=${albaran._id}&projectId=${project._id}`);
  };

  const handleSelectAlbaran = (albaran) => {
    const project = projects.find(project => project._id === albaran.projectId._id);
    const client = clients.find(client => client._id === project.clientId);
    setSelectedProject(project);
    setSelectedClient(client);
    setSelectedAlbaran(albaran);
  };

  const handleCloseAlbaranInfo = () => {
    setSelectedAlbaran(null);
  };

  const handleDownloadPDFById = (albaranId) => {
    const token = localStorage.getItem('jwt');
    fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${albaranId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download PDF.');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `albaran_${albaranId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        console.error('Error downloading PDF:', error);
        setError(error.message);
      });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (albaranes.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <EmptyState onCreate={handleCreateAlbaran} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 flex">
      <div className="flex-1">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Albaranes</h1>
          <div className="flex">
            <button onClick={handleCreateAlbaran} className="px-6 m-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Crear nuevo Albaran</button>
          </div>
        </div>
        <table className="w-full table-auto border-collapse shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left">Proyecto</th>
              <th className="p-4 text-left">Formato</th>
              <th className="p-4 text-left">Material</th>
              <th className="p-4 text-left">Horas</th>
              <th className="p-4 text-left">Descripccion</th>
              <th className="p-4 text-left">Fecha limite</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {albaranes.map((albaran) => {
              const project = projects.find(project => project._id === albaran.projectId);
              return (
                <AlbaranItem
                  key={albaran._id}
                  project={project}
                  albaran={albaran}
                  onSelect={handleSelectAlbaran}
                  onDelete={handleDeleteAlbaran}
                  onEdit={handleEditAlbaran}
                  onDownloadPDF={handleDownloadPDFById}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedAlbaran && (
        <div className="w-96 bg-white p-6 rounded-lg shadow-lg ml-8 relative">
          <button onClick={handleCloseAlbaranInfo} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-4xl">
            &times;
          </button>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información del Albarán</h2>
            <div className="space-y-2">
              <p className="text-lg text-gray-600"><strong>Proyecto:</strong> {selectedAlbaran.projectId.name}</p>
              <p className="text-lg text-gray-600"><strong>Formato:</strong> {selectedAlbaran.format}</p>
              <p className="text-lg text-gray-600"><strong>Material:</strong> {selectedAlbaran.material}</p>
              <p className="text-lg text-gray-600"><strong>Horas:</strong> {selectedAlbaran.hours}</p>
              <p className="text-lg text-gray-600"><strong>Descripción:</strong> {selectedAlbaran.description}</p>
              <p className="text-lg text-gray-600"><strong>Fecha Límite:</strong> {selectedAlbaran.workdate}</p>
            </div>
          </div>
          {selectedProject && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Información del Proyecto</h2>
              <div className="space-y-2">
                <p className="text-lg text-gray-600"><strong>ID:</strong> {selectedProject.projectCode}</p>
                <p className="text-lg text-gray-600"><strong>Fecha:</strong> {selectedProject.createdAt}</p>
                <p className="text-lg text-gray-600"><strong>Nombre:</strong> {selectedProject.name}</p>
                <p className="text-lg text-gray-600"><strong>Código Interno:</strong> {selectedProject.code}</p>
                <p className="text-lg text-gray-600"><strong>Status:</strong> {selectedProject.notes}</p>
              </div>
            </div>
          )}
          {selectedClient && (
            <div className="flex items-center mb-6">
              <img src={selectedClient.logo} alt={selectedClient.name} className="w-16 h-16 rounded-full mr-4" />
              <div>
                <p className="text-lg text-gray-600"><strong>Cliente:</strong> {selectedClient.name}</p>
              </div>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}
