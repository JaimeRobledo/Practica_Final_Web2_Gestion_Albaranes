'use client';
import React, { useState } from 'react';

export default function Sidebarclientes() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setSelectedFile(file);
    } else {
      alert('Selecciona una imagen PNG o JPG.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setSelectedFile(file);
    } else {
      alert('Arrastra una imagen PNG o JPG.');
    }
  };

  const handleUploadLogo = (client, file) => {
    console.log('Subiendo logo para el cliente seleccionado:', client.name);
    console.log('ID Cliente:', client._id);
    const formData = new FormData();
    formData.append("image", file);
  
    const token = localStorage.getItem('jwt');
    fetch(`https://bildy-rpmaya.koyeb.app/api/client/logo/${client._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(async (response) => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorDetails = await response.text();
          console.error('Error response from server:', errorDetails);
          throw new Error('Failed to upload logo.');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Logo uploaded successfully:', data);
        setSelectedClient({ ...client, logo: data.logo });
        window.location.reload(); 
      })
      .catch((error) => {
        console.error('Error uploading logo:', error);
        setError(error.message);
      });
  };
  

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!selectedFile) {
      alert('Seleccionas un archivo antes de hacer el upload.');
      return;
    }
  
    const clientName = prompt('Introduzca el nombre del cliente:');
    if (!clientName) {
      alert('El nombre del cliente es obligatorio.');
      return;
    }
  
    const token = localStorage.getItem('jwt');
    try {
      
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch clients.');
      }
  
      const clients = await response.json();
      const client = clients.find((c) => c.name.toLowerCase() === clientName.toLowerCase());
  
      if (!client || !client._id) {
        alert(`Client "${clientName}" does not exist.`);
        return;
      }
  
      
      handleUploadLogo(client, selectedFile);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError(error.message);
    }
  };
  

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Logo Cliente</h3>
        <div
          className="border-dashed border-2 border-gray-300 h-40 flex items-center justify-center rounded-lg"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input type="file" onChange={handleFileChange} className="hidden" id="logo-upload" />
          <label htmlFor="logo-upload" className="cursor-pointer text-gray-400 text-lg">
            {selectedFile ? selectedFile.name : 'Upload Image'}
          </label>
        </div>
        <button
          type="submit"
          onClick={handleUpload}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Upload
        </button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Notes</h3>
        <textarea
          placeholder="Add notes about your customer."
          className="w-full h-32 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Tags</h3>
        <input
          type="text"
          placeholder="Add tags to categorize."
          className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>
  );
}
