import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useEmployees } from '../../context/EmployeeContext';
import styles from './AddEmployeeForm.module.css';

const AddEmployeeForm = () => {
  const navigate = useNavigate();
  const { addEmployee } = useEmployees();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: '',
    gender: '',
    employeeId: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = ['Employee', 'Manager', 'Admin'];
  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];
  const genders = ['Male', 'Female', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user makes changes
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.role || 
        !formData.department || !formData.password || !formData.gender || 
        !formData.employeeId || !formData.dateOfBirth) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Create submission data without confirmPassword
      const submissionData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString().split('T')[0]
      };
      delete submissionData.confirmPassword;
      
      addEmployee(submissionData);
      alert('Employee added successfully!');
      navigate('/employees');
    } catch (err) {
      setError('Failed to add employee. Please try again.');
    }
  };

  return (
    <div className={styles.addEmployeeForm}>
      <h2>Add New Employee</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              placeholder="Enter employee ID"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              {genders.map(gender => (
                <option key={gender} value={gender.toLowerCase()}>{gender}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Enter password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm; 