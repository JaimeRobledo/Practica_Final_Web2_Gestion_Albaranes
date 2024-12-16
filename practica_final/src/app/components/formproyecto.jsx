import React, { useState, useEffect } from 'react';

function LoadingSpinner() {
    return <div className="text-center text-gray-500">Cargando...</div>;
}

export default function NewProjectForm({ onSubmit, initialClientId }) {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        projectCode: '',
        code: '',
        clientId: '',
        notes: '',
    });

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
                    if (!response.ok) throw new Error('Failed to fetch clients.');
                    return response.json();
                })
                .then((data) => {
                    setClients(data);
                    setLoading(false);
                    const client = data.find((client) => client._id === initialClientId);
                    if (client) {
                        setSelectedClient(client);
                        setFormData((prev) => ({ ...prev, clientId: client._id }));
                    }
                })
                .catch((error) => {
                    console.error('Error fetching clients:', error);
                    setError(error.message);
                    setLoading(false);
                });
        } else {
            setError('No authentication token found.');
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectClient = (e) => {
        const clientId = e.target.value;
        const client = clients.find(client => client._id === clientId);
        setSelectedClient(client);
        setFormData({ ...formData, clientId: client._id });
    };

    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        onSubmit(formData);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center p-0">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-6xl">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Crear Nuevo Proyecto</h2>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Nombre del proyecto</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">ID del proyecto</label>
                    <input
                        type="text"
                        name="projectCode"
                        value={formData.projectCode}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Codigo interno del proyecto</label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Status del proyecto</label>
                    <select name="notes" value={formData.notes} onChange={handleChange} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                        <option key="default" value="">Selecciona un estado</option>
                        <option key="completado" value="COMPLETADO">COMPLETADO</option>
                        <option key="pendiente" value="PENDIENTE">PENDIENTE</option>
                        <option key="cancelado" value="CANCELADO">CANCELADO</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300">Crear Proyecto</button>
            </form>
            <div className="mb-6">
                <div className="block justify-center ml-8 text-gray-700 font-semibold mb-2">Cliente asociado a el proyecto</div>
                <select
                    name="clientes"
                    value={selectedClient ? selectedClient._id : ''}
                    onChange={handleSelectClient}
                    className="w-96 justify-center mb-2 ml-8 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">Selecciona un cliente</option>
                    {clients.map(client => (
                        <option key={client._id} value={client._id}>
                            {client.name}
                        </option>
                    ))}
                </select>

                {selectedClient && (
                    <div className="w-96 bg-white p-6 rounded-lg shadow-lg ml-8 relative">
                    <div className="flex items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Información del Cliente</h2>
                    </div>
                    <div className="w-64 h-64 bg-gray-300 rounded-full mt-16 mb-16 ml-9 flex items-center justify-center">
                        <img src={selectedClient.logo || '/default-logo.png'} alt="Logo" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <p className="text-lg text-gray-600"><strong>Nombre:</strong> {selectedClient.name}</p>
                    <p className="text-lg text-gray-600"><strong>Dirección:</strong> {selectedClient.address.street}, {selectedClient.address.city}</p>
                    <p className="text-lg text-gray-600"><strong>CIF:</strong> {selectedClient.cif}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
