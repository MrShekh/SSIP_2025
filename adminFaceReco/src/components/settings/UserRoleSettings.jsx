import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Upload,
  Download,
} from '@mui/icons-material';
import styles from './Settings.module.css';

const UserRoleSettings = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      permissions: {
        viewReports: true,
        modifyAttendance: true,
        manageUsers: true,
        manageSettings: true,
      },
    },
    {
      id: 2,
      name: 'HR Manager',
      permissions: {
        viewReports: true,
        modifyAttendance: true,
        manageUsers: true,
        manageSettings: false,
      },
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddRole = () => {
    setSelectedRole(null);
    setOpenDialog(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setOpenDialog(true);
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handleImport = () => {
    // Implement CSV/Excel import
    console.log('Importing users...');
  };

  const handleExport = () => {
    // Implement CSV/Excel export
    console.log('Exporting users...');
  };

  return (
    <Box className={styles.settingsSection}>
      <Typography variant="h6" gutterBottom>User & Role Management</Typography>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Roles & Permissions</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddRole}
            size="small"
            className={styles.primaryButton}
          >
            Add Role
          </Button>
        </div>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>View Reports</TableCell>
                <TableCell>Modify Attendance</TableCell>
                <TableCell>Manage Users</TableCell>
                <TableCell>Manage Settings</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <Checkbox checked={role.permissions.viewReports} disabled />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={role.permissions.modifyAttendance} disabled />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={role.permissions.manageUsers} disabled />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={role.permissions.manageSettings} disabled />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditRole(role)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRole(role.id)} size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingHeader}>
          <Typography variant="subtitle1">Student Data Management</Typography>
          <div className={styles.actionButtons}>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={handleImport}
              size="small"
            >
              Import
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
              size="small"
            >
              Export
            </Button>
          </div>
        </div>

        <TextField
          fullWidth
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Add student data rows here */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRole ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            value={selectedRole?.name || ''}
          />
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Permissions
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRole?.permissions.viewReports || false}
              />
            }
            label="View Reports"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRole?.permissions.modifyAttendance || false}
              />
            }
            label="Modify Attendance"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRole?.permissions.manageUsers || false}
              />
            }
            label="Manage Users"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRole?.permissions.manageSettings || false}
              />
            }
            label="Manage Settings"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" className={styles.primaryButton}>
            {selectedRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserRoleSettings;
