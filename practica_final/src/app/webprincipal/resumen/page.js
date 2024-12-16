import React from 'react';
import IRSLogo from '../../images/IRS.png';

export default function Resumen() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white p-4">
      </div>
      <div className="flex-1 p-8">
        <img src={IRSLogo.src} alt="IRS Logo" className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Resumen de la Página</h1>
        <p className="text-lg text-center mb-8 text-gray-600">Esta página proporciona información sobre los servicios y funciones de la IRS.</p>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">¿Qué hace la IRS?</h2>
        <p className="text-lg mb-4 text-gray-600">La IRS (Internal Revenue Service) es la agencia del gobierno de los Estados Unidos responsable de la recaudación de impuestos y la aplicación de las leyes fiscales.</p>
      
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">¿Cómo funciona la IRS?</h2>
        <p className="text-lg mb-4 text-gray-600">La IRS procesa las declaraciones de impuestos, emite reembolsos y realiza auditorías para garantizar el cumplimiento de las leyes fiscales. Utiliza tecnología avanzada para detectar fraudes y errores en las declaraciones de impuestos.</p>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">¿Cómo se hizo este sitio web?</h2>
        <p className="text-lg mb-4 text-gray-600">Este sitio web está construido utilizando React, un marco de JavaScript popular para construir interfaces de usuario. Utiliza componentes reutilizables y un diseño responsivo para proporcionar una experiencia de usuario óptima en diferentes dispositivos.</p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Tecnologías Utilizadas</h3>
          <ul className="list-disc list-inside text-lg text-gray-600">
            <li>React</li>
            <li>Tailwind CSS</li>
            <li>JavaScript</li>
            <li>HTML</li>
            <li>CSS</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Características del Sitio</h3>
          <ul className="list-disc list-inside text-lg text-gray-600">
            <li>Diseño Responsivo</li>
            <li>Componentes Reutilizables</li>
            <li>Navegación Intuitiva</li>
            <li>Rendimiento Optimizado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
