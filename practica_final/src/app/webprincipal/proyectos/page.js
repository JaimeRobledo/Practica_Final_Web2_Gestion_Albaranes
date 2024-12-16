'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FotoProyecto from '../../images/crearproyecto.png';

function ProjectItem({ project, client, onSelect, onDelete, onEdit }) {
  return (
    <tr className="bg-white hover:bg-gray-100 cursor-pointer" onClick={() => onSelect(project)}>
      <td className="p-4 text-left">{project.projectCode}</td>
      <td className="p-4 text-left">{project.createdAt}</td>
      <td className="p-4 text-left">{project.name}</td>
      <td className="p-4 text-left">
        <img src={client?.logo} alt={client?.name} className="w-8 h-8 rounded-full inline-block mr-2" />
        {client?.name}
      </td>
      <td className="p-4 text-left">{project.code}</td>
      <td className="p-4 text-left">{project.notes}</td>
      <td className="p-4 text-left">
        <div className="flex space-x-2">
          <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">Editar</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(project._id); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300">Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="text-center">
      <img src={FotoProyecto.src} alt="Create Project" className="w-128 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Crea tu primer Proyecto</h2>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientError, setClientError] = useState(null);

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
          setClientError(error.message);
        });
    }
  }, []);

  

  const handleCreateProject = () => {
    if (clients.length === 0) {
      setClientError('Primero tienes que crear un cliente.');
      return;
    }
    router.push('/webprincipal/proyectos/nuevoproyecto');
  };

  const handleDeleteProject = (projectId) => {
    const token = localStorage.getItem('jwt');
    fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete project.');
        }
        setProjects(projects.filter(project => project._id !== projectId));
      })
      .catch((error) => {
        console.error('Error deleting project:', error);
        setError(error.message);
      });
  };

  const handleSelectClient = (clientId) => {
    const client = clients.find(client => client._id === clientId);
    setSelectedClient(client);
  };

  const handleEditProject = (project) => {
    const client = clients.find(client => client._id === project.clientId);
    router.push(`/webprincipal/proyectos/editproyecto?projectId=${project._id}&clientId=${client._id}`);
  };

  const handleSelectProject = (project) => {
    const client = clients.find(client => client._id === project.clientId);
    setSelectedProject(project);
    setSelectedClient(client);
  };

  const handleCloseProjectInfo = () => {
    setSelectedProject(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (clientError) {
    return <div className="text-center text-red-500">Error: {clientError}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <EmptyState onCreate={handleCreateProject} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 flex">
      <div className="flex-1">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Proyectos</h1>
          <button onClick={handleCreateProject} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Crear nuevo proyecto</button>
        </div>
        <table className="w-full table-auto border-collapse shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Fecha</th>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Código Interno</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const client = clients.find(client => client._id === project.clientId);
              return (
                <ProjectItem
                  key={project._id}
                  project={project}
                  client={client}
                  onSelect={handleSelectProject}
                  onDelete={handleDeleteProject}
                  onEdit={handleEditProject}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedProject && (
        <div className="w-96 bg-white p-6 rounded-lg shadow-lg ml-8 relative">
          <button onClick={handleCloseProjectInfo} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-4xl">
            &times;
          </button>
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Información del Proyecto</h2>
          </div>
          <p className="text-lg text-gray-600"><strong>ID:</strong> {selectedProject.projectCode}</p>
          <p className="text-lg text-gray-600"><strong>Fecha:</strong> {selectedProject.createdAt}</p>
          <p className="text-lg text-gray-600"><strong>Nombre:</strong> {selectedProject.name}</p>
          {selectedClient && (
            <div className="flex items-center mb-4">
              <img src={selectedClient.logo} alt={selectedClient.name} className="w-16 h-16 rounded-full mr-4" />
              <div>
                <p className="text-lg text-gray-600"><strong>Cliente:</strong> {selectedClient.name}</p>
              </div>
            </div>
          )}
          <p className="text-lg text-gray-600"><strong>Código Interno:</strong> {selectedProject.code}</p>
          <p className="text-lg text-gray-600"><strong>Status:</strong> {selectedProject.notes}</p>
        </div>
      )}
    </div>
  );
}
