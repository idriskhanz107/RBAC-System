import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h1 className="text-2xl font-bold mb-6">RBAC Dashboard</h1>
        <nav>
          <ul>
            <li>
              <Link to="/users" className="block py-2 px-4 rounded hover:bg-gray-700">
                Users
              </Link>
            </li>
            <li>
              <Link to="/roles" className="block py-2 px-4 rounded hover:bg-gray-700">
                Roles
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
};

export default Layout;
