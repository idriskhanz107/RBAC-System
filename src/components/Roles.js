import React, { useState, useEffect } from 'react';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', permissions: [], status: 'Active' });
  const [allPermissions] = useState(['Read', 'Write', 'Delete', 'Execute']);
  const [statuses] = useState(['Active', 'Inactive']);
  const [showModal, setShowModal] = useState(false);

  // Pagination states
  const [rolesPerPage] = useState(5); // Number of roles per page
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('http://localhost:5000/roles')
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
        setFilteredRoles(data);
      });
  }, []);

  // Filter roles based on search term, selected permissions, and status
  const filterRoles = () => {
    let updatedRoles = roles;

    if (searchTerm) {
      updatedRoles = updatedRoles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPermission.length > 0) {
      updatedRoles = updatedRoles.filter((role) =>
        selectedPermission.every((permission) =>
          role.permissions.includes(permission)
        )
      );
    }

    if (selectedStatus) {
      updatedRoles = updatedRoles.filter((role) => role.status === selectedStatus);
    }

    setFilteredRoles(updatedRoles);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePermissionFilter = (e) => {
    const value = e.target.value;
    setSelectedPermission((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSort = () => {
    const sortedRoles = [...filteredRoles].sort((a, b) => {
      if (isAscending) return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    setFilteredRoles(sortedRoles);
    setIsAscending(!isAscending);
  };

  useEffect(() => {
    filterRoles();
  }, [searchTerm, selectedPermission, selectedStatus, roles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePermissionToggle = (permission) => {
    setFormData((prev) => {
      const permissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions };
    });
  };

  const handleAddRole = () => {
    fetch('http://localhost:5000/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((newRole) => {
        const updatedRoles = [...roles, newRole];
        setRoles(updatedRoles);
        setFilteredRoles(updatedRoles);
        setFormData({ name: '', permissions: [], status: 'Active' });
        setShowModal(false); // Close modal after creation
      });
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData(role);
  };

  const handleUpdateRole = () => {
    fetch(`http://localhost:5000/roles/${editingRole.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((updatedRole) => {
        const updatedRoles = roles.map((r) =>
          r.id === updatedRole.id ? updatedRole : r
        );
        setRoles(updatedRoles);
        setFilteredRoles(updatedRoles);
        setEditingRole(null);
        setFormData({ name: '', permissions: [], status: 'Active' });
      });
  };

  const handleDeleteRole = (id) => {
    fetch(`http://localhost:5000/roles/${id}`, { method: 'DELETE' }).then(() => {
      const updatedRoles = roles.filter((role) => role.id !== id);
      setRoles(updatedRoles);
      setFilteredRoles(updatedRoles);
    });
  };

  // Pagination logic
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handlePageSelect = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Role Management</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Filter by Permission */}
      <div className="mb-4">
        <label className="block mb-2">Filter by Permissions</label>
        <div className="flex gap-4">
          {allPermissions.map((permission) => (
            <label key={permission} className="flex items-center">
              <input
                type="checkbox"
                value={permission}
                checked={selectedPermission.includes(permission)}
                onChange={handlePermissionFilter}
                className="mr-2"
              />
              {permission}
            </label>
          ))}
        </div>
      </div>

      {/* Filter by Status */}
      <div className="mb-4">
        <select
          value={selectedStatus}
          onChange={handleStatusFilter}
          className="w-full p-2 border rounded"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Button */}
      <div className="mb-4">
        <button
          onClick={handleSort}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sort by Name ({isAscending ? 'Ascending' : 'Descending'})
        </button>
      </div>

      {/* Roles Table */}
      <table className="table-auto w-full bg-white shadow-md rounded mb-4">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Role Name</th>
            <th className="px-4 py-2">Permissions</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRoles.map((role) => (
            <tr key={role.id}>
              <td className="border px-4 py-2">{role.name}</td>
              <td className="border px-4 py-2">
                {role.permissions.join(', ')}
              </td>
              <td className="border px-4 py-2">{role.status}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => handleEditRole(role)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDeleteRole(role.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <select
          value={currentPage}
          onChange={handlePageSelect}
          className="p-2 border rounded"
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              Page {index + 1}
            </option>
          ))}
        </select>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Role Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Create Role</h3>
            <input
              type="text"
              name="name"
              placeholder="Role Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="mb-4">
              <label className="block mb-2">Permissions</label>
              <div className="flex gap-4">
                {allPermissions.map((permission) => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      value={permission}
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      className="mr-2"
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddRole}
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
