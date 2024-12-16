'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import IRSLogo from '../images/IRS.png';
import Navbar from './navbar';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev); 
  };

  return (
    <div className="flex">
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-48 w-64'
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-5">
            <a href="/webprincipal" className="flex items-center ps-2.5">
              <img
                src={IRSLogo.src}
                className="h-9 me-3 sm:h-20"
                alt="IRS Logo"
              />
              <span className="self-center font-semibold whitespace-nowrap dark:text-white text-4xl ">
                IRS
              </span>
            </a>
            <button
              onClick={toggleSidebar} 
              className="text-gray-900 dark:text-white px-2 py-1 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-5xl"
            >
              {isOpen ? '>' : '<'}
            </button>
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <a href="/webprincipal/resumen" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group text-xl">
                <span className="ms-3">Resumen</span>
              </a>
            </li>
            <li>
              <a href="/webprincipal/clients" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group text-xl">
                <span className="flex-1 ms-3 whitespace-nowrap">Clients</span>
              </a>
            </li>
            <li>
              <a href="/webprincipal/proyectos" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group text-xl">
                <span className="flex-1 ms-3 whitespace-nowrap">Proyectos</span>
              </a>
            </li>
            <li>
              <a href="/webprincipal/albaranes" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group text-xl">
                <span className="flex-1 ms-3 whitespace-nowrap">Albaranes</span>
              </a>
            </li>
            <li>
              <a href="/webprincipal/ajustes" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group text-xl">
                <span className="flex-1 ms-3 whitespace-nowrap">Ajustes</span>
              </a>
            </li>
            <li>
              <a href="/login" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group text-xl">
                <span className="flex-1 ms-3 whitespace-nowrap">Sign-out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <div className={`flex-1 transition-all ${isOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
      </div>
    </div>
  );
}
export default Sidebar;