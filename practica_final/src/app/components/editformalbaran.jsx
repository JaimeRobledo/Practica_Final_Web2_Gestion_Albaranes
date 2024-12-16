'use client';
import React, { useState, useEffect } from 'react';

export default function EditAlbaranForm({ onSubmit, initialData, initialProjectId }) {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
            clientId: "",
            projectId: "",
            format: "",
            material: "",
            hours: "",
            description: "",
            workdate: ""
        });

    useEffect(() => {
        if (initialData) {
        setFormData({
            clientId: initialData.clientId || '',
            projectId: initialData.projectId || '',
            format: initialData.format || '',
            material: initialData.material || '',
            hours: initialData.hours || '',
            description: initialData.description || '',
            workdate: initialData.workdate || ''
        });
        if (initialProjectId) {
            setFormData(prevFormData => ({ ...prevFormData, projectId: initialProjectId }));
        }
        }
    }, [initialData, initialProjectId]);

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
                    if (initialProjectId) {
                        const project = data.find(project => project._id === initialProjectId);
                        if (project) {
                            setSelectedProject(project);
                        }
                    }
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
                  if (selectedProject) {
                      const token = localStorage.getItem('jwt');
                      
                      if (token) {
                          fetch(`https://bildy-rpmaya.koyeb.app/api/client/${selectedProject.clientId}`, {
                              method: 'GET',
                              headers: {
                                  Authorization: `Bearer ${token}`,
                              },
                          })
                          .then((response) => {
                              if (!response.ok) {
                                  throw new Error('Failed to fetch client.');
                              }
                              return response.json();
                          })
                          .then((data) => {
                              setSelectedClient(data);
                              setFormData({ ...formData, clientId: selectedProject.clientId });
                              setLoading(false);
                          })
                          .catch((error) => {
                              console.error('Error fetching client:', error);
                              setError(error.message);
                              setLoading(false);
                          });
                      } else {
                          setLoading(false);
                          setError('No authentication token found.');
                      }
                  }
                }, [selectedProject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectProject = (e) => {
        const projectId = e.target.value;
        const project = projects.find(project => project._id === projectId);
        setSelectedProject(project);
        setFormData(prevFormData => ({ ...prevFormData, projectId: projectId }));
        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        onSubmit(formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center p-0">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-6xl">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Crear Nuevo Albaran</h2>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Formato del Albaran</label>
                    <select name="format" value={formData.format} onChange={handleChange} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                        <option key="default" value="">Selecciona un formato</option>
                        <option key="material" value="material">material</option>
                        <option key="hours" value="hours">horas</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Tipo de material</label>
                    <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Horas</label>
                    <input
                        type="text"
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Descripcion</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        rows="5"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Fecha de Trabajo</label>
                    <input
                        type="date"
                        name="workdate"
                        value={formData.workdate}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300">Crear Albaran</button>
            </form>
            <div className="mb-6 ">
                <div className="block text-gray-700 font-semibold mb-2 ml-8">Proyecto asociado a el Albaran</div>
                <select
                    name="proyectos"
                    value={selectedProject ? selectedProject._id : ''}
                    onChange={handleSelectProject}
                    className="w-96 p-3 border rounded-md mb-2 ml-8 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">Selecciona un proyecto</option>
                    {projects.map(project => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>

                {selectedProject && (
                    <div className="w-96 bg-white p-6 rounded-lg shadow-lg ml-8 relative">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-4xl">
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
        </div>
    );
}
