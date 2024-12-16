'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import IRSLogo from '../images/IRS.png';

export default function Login() {
  const [error, setError] = useState('');
  const router = useRouter();

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Introduce un email válido';
    }

    if (!values.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (values.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validate,
    onSubmit: async (values) => {
      try {
        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          
          localStorage.setItem('jwt', data.token);

          // Redirigir al dashboard o página principal
          router.push('/webprincipal');
        } else {
          // Manejar errores, por ejemplo, credenciales incorrectas
          setError(data.message || 'Hubo un problema al iniciar sesion. Comprueba que la contraseña y el email sean correctos');
        }
      } catch (error) {
        setError('Error al conectar con el servidor.');
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[30vw] h-[60vh]">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-center mb-4">
            <img src={IRSLogo.src} alt="IRS Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold mb-7 text-center">IRS</h1>
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-xl font-bold mb-2">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-md ${
                formik.touched.email && formik.errors.email 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-xl font-bold mb-2">Contraseña:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-md ${
                formik.touched.password && formik.errors.password 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!formik.isValid}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
          >
            Iniciar sesion
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta? {' '}
              <Link 
                href="/register" 
                className="text-blue-500 hover:underline"
              >
                Registrate aquí
              </Link>
            </p>
          </div>
        </form> 
      </div>
    </div>
  );
}