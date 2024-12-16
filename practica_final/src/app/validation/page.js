'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Verify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('El código de verificación es obligatorio.');
      return;
    }

    const token = localStorage.getItem('jwt'); 
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    setLoading(true);
    setError('');  // Reset any previous error message

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cuenta validada exitosamente');
        updateUserProfile(firstName, lastName);
        router.push('/login');
      } else {
        setError(data.message || 'Código inválido');
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserProfile = async (firstName, lastName) => {
    const token = localStorage.getItem('jwt');
    
    const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName }),
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('Profile updated successfully');
    } else {
      console.log(data.message || 'Error updating profile');
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('El código de verificación ha sido reenviado.');
      } else {
        setError(data.message || 'Error al reenviar el código.');
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[30vw] h-[40vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">Verificación de Cuenta</h1>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        {success && <p className="text-green-500 text-xs mb-4">{success}</p>}

        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700 text-xl font-bold mb-2">Código de Verificación:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={handleCodeChange}
              className="w-full px-3 py-2 border rounded-md border-gray-300"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Verificar Cuenta'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No recibiste el código? {' '}
            <a
              href="#"
              className="text-blue-500 hover:underline"
              onClick={handleResendCode}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar código nuevamente'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
