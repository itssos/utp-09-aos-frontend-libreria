import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { NAV_CONFIG } from '../constants/navConfig';
import { Bars3Icon, PowerIcon } from '@heroicons/react/24/outline';

export default function HorizontalNavBar({ vertical = false }) {
  const { user, logout } = useAuth();
  const userPermissions = user?.permissions || [];
  const navItems = NAV_CONFIG.filter(item =>
    !item.permissions || item.permissions.some(permission => userPermissions.includes(permission))
  );

  const [menuOpen, setMenuOpen] = useState(false);

  // Layout VERTICAL (Sidebar)
  if (vertical) {
    return (
      <nav className="h-full flex flex-col py-6 px-4 gap-2">
        <div className="mb-8 text-xl font-bold text-gray-800 text-center">
          Libreria Jesus Amigo
        </div>
        <ul className="flex flex-col gap-2">
          {navItems.map(({ name, path, Icon }) => (
            <li key={name}>
              <Link to={path}>
                <button
                  className="group flex items-center w-full space-x-3 p-2 rounded-lg hover:bg-gray-100 hover:scale-[1.03] transition"
                >
                  <Icon className="h-6 w-6 text-gray-700 group-hover:text-sky-500" />
                  <span className="text-gray-700 group-hover:text-sky-500">{name}</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
        {user && (
          <button
            onClick={logout}
            className="mt-auto flex items-center space-x-3 p-2 rounded-lg hover:bg-red-200 hover:scale-[1.03] transition"
          >
            <PowerIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
            <span className="text-gray-700 group-hover:text-gray-900">Salir</span>
          </button>
        )}
      </nav>
    );
  }

  // Layout HORIZONTAL (Arriba)
  return (
    <nav className="p-4 rounded-2xl shadow-lg w-full">
      <div className="flex items-center justify-between gap-x-16">
        {/* Logo o título de la app */}
        <div className="text-lg font-bold text-gray-800">
          Libreria Jesus Amigo
        </div>

        {/* Botón del menú para móviles */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded hover:bg-gray-100 cursor-pointer"
            aria-label="Abrir menú"
          >
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Menú horizontal (visible en pantallas sm y superiores) */}
        <ul className="hidden sm:flex items-center space-x-6">
          {navItems.map(({ name, path, Icon }) => (
            <li key={name}>
              <Link to={path}>
                <button
                  className="group flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 hover:scale-105 transition"
                >
                  <Icon className="h-6 w-6 text-gray-700 group-hover:text-sky-500" />
                  <span className="text-gray-700 group-hover:text-sky-500">{name}</span>
                </button>
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={logout}
                className="group flex items-center space-x-2 p-2 rounded-lg hover:bg-red-200 hover:scale-105 transition"
              >
                <PowerIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
                <span className="text-gray-700 group-hover:text-gray-900">Salir</span>
              </button>
            </li>
          )}
        </ul>
      </div>
      {/* Menú móvil desplegable */}
      {menuOpen && (
        <ul className="sm:hidden mt-4 space-y-4">
          {navItems.map(({ name, path, Icon }) => (
            <li key={name}>
              <Link to={path} onClick={() => setMenuOpen(false)}>
                <button className="w-full group flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 hover:scale-105 transition">
                  <Icon className="h-6 w-6 text-gray-700 group-hover:text-sky-500" />
                  <span className="text-gray-700 group-hover:text-sky-500">{name}</span>
                </button>
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full group flex items-center space-x-2 p-2 rounded-lg hover:bg-red-200 hover:scale-105 transition"
              >
                <PowerIcon className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
                <span className="text-gray-700 group-hover:text-gray-900">Salir</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
