import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import styles from './RoleManagement.module.css';

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', permissions: ['all'] },
    { id: 2, name: 'HR Manager', permissions: ['view_employees', 'edit_employees', 'add_employees', 'view_attendance'] },
    { id: 3, name: 'Employee', permissions: ['view_self', 'view_attendance'] }
  ]);

  const [editingRole, setEditingRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const allPermissions = [
    { id: 'manage_employees', label: 'Manage Employees' },
    { id: 'manage_roles', label: 'Manage Roles' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'manage_attendance', label: 'Manage Attendance' },
    { id: 'manage_settings', label: 'Manage Settings' },
    { id: 'view_team', label: 'View Team' },
    { id: 'view_profile', label: 'View Profile' },
    { id: 'view_attendance', label: 'View Attendance' }
  ];

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowAddForm(false);
  };

  const handleDeleteRole = (roleId) => {
    // Implement delete functionality
    console.log('Delete role:', roleId);
  };

  return (
    <div className={styles.roleManagement}>
      <div className={styles.header}>
        <h2>Role Management</h2>
        <button
          className={styles.addButton}
          onClick={() => {
            setShowAddForm(true);
            setEditingRole(null);
          }}
        >
          <AiOutlinePlus /> Add Role
        </button>
      </div>

      <div className={styles.rolesGrid}>
        {roles.map(role => (
          <div key={role.id} className={styles.roleCard}>
            <div className={styles.roleHeader}>
              <h3>{role.name}</h3>
              <div className={styles.actions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleEditRole(role)}
                >
                  <AiOutlineEdit />
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => handleDeleteRole(role.id)}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
            <p className={styles.roleDescription}>{role.description}</p>
            <div className={styles.permissions}>
              <h4>Permissions:</h4>
              <ul>
                {role.permissions.map(permission => (
                  <li key={permission}>
                    {allPermissions.find(p => p.id === permission)?.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {(showAddForm || editingRole) && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{editingRole ? 'Edit Role' : 'Add New Role'}</h3>
            {/* Add/Edit role form will go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement; 