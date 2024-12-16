'use client';
import React, { useState, useEffect } from 'react';
import IRSLogo from '../../images/IRS.png';

export default function Ajustes() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
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

    const handleUploadLogo = (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const token = localStorage.getItem('jwt');
        fetch(`https://bildy-rpmaya.koyeb.app/api/user/logo`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
        .then(async (response) => {
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Error response from server:', errorDetails);
                throw new Error('Failed to upload logo.');
            }
            return response.json();
        })
        .then((data) => {
            setProfilePic(data.logo);
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error uploading logo:', error);
            setError(error.message);
        });
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Selecciona un archivo antes de hacer el upload.');
            return;
        }

        handleUploadLogo(selectedFile);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-gray-800 text-white p-4">
            </div>
            <div className="flex-1 p-8">
                <img src={profilePic || IRSLogo.src} alt="Profile" className="w-32 h-32 mx-auto mb-4 " />
                <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Ajustes de la Página</h1>
                <p className="text-lg text-center mb-8 text-gray-600">Esta página proporciona información sobre los ajustes y configuraciones de la IRS.</p>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">¿Qué ajustes se pueden configurar?</h2>
                <p className="text-lg mb-4 text-gray-600">Por ahora solo la foto de perfil del usuario</p>
                <div className="bg-white mb-4 p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Foto de Perfil</h3>
                    <div
                        className="border-dashed border-2 border-gray-300 h-40 flex items-center justify-center rounded-lg"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <input type="file" onChange={handleFileChange} className="hidden" id="profile-upload" />
                        <label htmlFor="profile-upload" className="cursor-pointer text-gray-400 text-lg">
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
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">¿Cómo se guardan los ajustes?</h2>
                <p className="text-lg mb-4 text-gray-600">Los ajustes se guardan en la base de datos de la IRS y se aplican a la cuenta de usuario correspondiente. Los usuarios pueden acceder a sus ajustes desde cualquier dispositivo una vez que hayan iniciado sesión en su cuenta.</p>
            </div>
        </div>
    );
}