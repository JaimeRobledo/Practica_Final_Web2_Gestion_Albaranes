'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FotoReunion from '../../images/meeting.png';
import Sidebarclientes from '../../components/sidebarclientes';

function ClientItem({ client, onSelect, onDelete, onEdit }) {
  return (
    <li className="mb-4 p-4 bg-white rounded-lg shadow-lg cursor-pointer" onClick={() => onSelect(client)}>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
          <img src={client.logo || '/default-logo.png'} alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{client.name}</h2>
          <p className="text-gray-500">{client.address.street}, {client.address.city}</p>
          <p className="text-gray-500">CIF: {client.cif}</p>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <button onClick={(e) => { e.stopPropagation(); onEdit(client); }} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300">Editar</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(client._id); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300">Eliminar</button>
      </div>
    </li>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="text-center">
      <img src={FotoReunion.src} alt="Create Client" className="w-128 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Crea tu primer Cliente</h2>
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

export default function Clients() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject]= useState(null);

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
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching clients:', error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('No authentication token found.');
    }
  }, []);

  const handleCreateClient = () => {
    router.push('/webprincipal/clients/nuevocliente');
  };

  const handleEditClient = (client) => {
    router.push(`/webprincipal/clients/editcliente?clientId=${client._id}`);//Jaime del futuro, no te olvide de editar esto para poder hacerlo en un page diferente ${client._id}
  };

  const handleCreateProject = () => {
    router.push(`/webprincipal/proyectos/nuevoproyecto?clientId=${selectedClient._id}`);
  };

  const handleDeleteClient = (clientId) => {
    const token = localStorage.getItem('jwt');
    fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete client.');
        }
        setClients(clients.filter(client => client._id !== clientId));
      })
      .catch((error) => {
        console.error('Error deleting client:', error);
        setError(error.message);
      });
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    handleSelectProject(client._id);
  };

  const handleSelectProject = (clientId) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      fetch(`https://bildy-rpmaya.koyeb.app/api/project/${clientId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch project.');
          }
          return response.json();
        })
        .then((data) => {
          setSelectedProject(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching project:', error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('No authentication token found.');
    }
  };

  const handleCloseClientInfo = () => {
    setSelectedClient(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (clients.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <EmptyState onCreate={handleCreateClient} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 flex">
      <div className="flex-1">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Clientes</h1>
          <button onClick={handleCreateClient} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Crear nuevo cliente</button>
        </div>
        <ul>
          {clients.map((client) => (
            <ClientItem
              key={client._id}
              client={client}
              onSelect={handleSelectClient}
              onDelete={handleDeleteClient}
              onEdit={handleEditClient}
            />
          ))}
        </ul>
      </div>
      {selectedClient && (
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg ml-4 relative">
          <button onClick={handleCloseClientInfo} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-4xl">
            &times;
          </button>
          <div className="flex items-center mb-4 justify-center">
            <h2 className="text-2xl font-bold text-gray-800">Información del Cliente</h2>
          </div>
          <div className="w-64 h-64 bg-gray-300 rounded-full mt-16 mb-16 mx-auto flex items-center justify-center">
            <img src={selectedClient.logo || '/default-logo.png'} alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-600"><strong>Nombre:</strong> {selectedClient.name}</p>
            <p className="text-lg text-gray-600"><strong>Dirección:</strong> {selectedClient.address.street}, {selectedClient.address.city}</p>
            <p className="text-lg text-gray-600"><strong>CIF:</strong> {selectedClient.cif}</p>
          </div>
          {selectedProject && (
            <div className="w-full bg-white p-6 rounded-lg shadow-lg mt-8 relative">
              <div className="flex items-center mb-4 justify-between ">
                <h2 className="text-2xl font-bold text-gray-800">Proyectos del cliente</h2>
                <button onClick={handleCreateProject} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Crear nuevo proyecto</button>
              </div>
              
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Fecha</th>
                    <th className="p-4 text-left">Nombre</th>
                    <th className="p-4 text-left">Cliente</th>
                    <th className="p-4 text-left">Código Interno</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProject.map((project) => (
                    <tr key={project._id}>
                      <td className="p-4 text-left">{project.projectCode}</td>
                      <td className="p-4 text-left">{new Date(project.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-left">{project.name}</td>
                      <td className="p-4 text-left">
                        <img src={selectedClient?.logo} alt={selectedClient?.name} className="w-8 h-8 rounded-full inline-block mr-2" />
                        {selectedClient?.name}
                      </td>
                      <td className="p-4 text-left">{project.code}</td>
                      <td className="p-4 text-left">{project.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
