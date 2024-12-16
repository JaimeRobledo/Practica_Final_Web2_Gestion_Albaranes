import React, { useState, useEffect } from 'react';

const Navbar = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const nombreUsuario = localStorage.getItem('firstName');
  const apellidoUsuario = localStorage.getItem('lastName');

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      fetch('https://bildy-rpmaya.koyeb.app/api/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((response) => {
        if (!response.ok) throw new Error('Failed to fetch user.');
        return response.json();
      }).then((data) => {
        console.log("Data usuario:",data);
        setUser(data);
      }).catch((error) => {
        console.error('Error fetching user:', error);
        setError(error.message);
      });
    } else {
      setError('No authentication token found.');
    }
  }, []);


  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center pr-4">
      <div className="flex items-center w-1/2">
        <input
          type="text"
          className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg"
          placeholder="Search"
        />
        <button className="ml-2 p-2 bg-gray-200 rounded-lg">
          🔍
        </button>
      </div>

      <div className="flex items-center text-white">
        {user && (
          <div className="flex justify-between">
            <p className="mr-2 mt-4 text-2xl">{nombreUsuario} {apellidoUsuario}</p>
            <img src={user.logo || '/default-logo.png'} alt="Logo" className="w-14 h-14 bg-gray-400 rounded-full" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
