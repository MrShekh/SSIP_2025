import React, { useState, useEffect } from 'react';
import { HiX, HiUser, HiMail, HiPhone, HiOfficeBuilding, HiIdentification } from 'react-icons/hi';
import { FaUserTag, FaIdCard } from 'react-icons/fa';
import { AiOutlineClose, AiOutlineUpload, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaGraduationCap, FaSchool, FaUniversity, FaFileUpload, FaTimes, FaEdit, FaCamera, FaImage, FaUpload } from 'react-icons/fa';
import { useEmployees } from '../../context/EmployeeContext';
import styles from './EditEmployeePanel.module.css';

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/jpg";
const IMAGE_ERROR_MESSAGE = "Please upload a valid image file (JPG, JPEG, or PNG)";
const FILE_SIZE_ERROR = "File size should be less than 5MB";
const STORAGE_KEY = "employeeFormData";

const EditEmployeePanel = ({ employee, onClose, onSaveComplete, readOnly = false }) => {
  const { updateEmployee } = useEmployees();
  const [formData, setFormData] = useState({
    // Account Details
    employeeId: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    
    // Personal Details
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    bloodGroup: '',
    maritalStatus: '',
    profilePhoto: null,
    
    // Contact Information
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Bank Details
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: '',
    bankStatement: null,
    
    // Identity Documents
    aadharCard: null,
    panCard: null,
    passport: null,
    drivingLicense: null,
    voterId: null
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [educationData, setEducationData] = useState({
    tenth: {
      rollNo: '',
      cgpa: '',
      schoolName: '',
      schoolAddress: '',
      passoutYear: '',
      certificate: null
    },
    twelfth: {
      rollNo: '',
      cgpa: '',
      schoolName: '',
      schoolAddress: '',
      passoutYear: '',
      certificate: null
    },
    undergraduate: {
      universityName: '',
      uid: '',
      courseBranch: '',
      cgpa: '',
      passoutYear: '',
      certificate: null
    }
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalType, setModalType] = useState('');

  const roles = ['Admin', 'HR', 'Manager', 'Employee'];
  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // Get stored form data
        const savedFormData = localStorage.getItem(`${STORAGE_KEY}_form`);
        const savedEducationData = localStorage.getItem(`${STORAGE_KEY}_education`);
        
        if (savedFormData) {
          const parsedFormData = JSON.parse(savedFormData);
          // Only use text data from local storage, not files
          const textOnlyFormData = Object.fromEntries(
            Object.entries(parsedFormData).filter(([key, value]) => 
              typeof value !== 'object' || value === null
            )
          );
          
          setFormData(prev => ({
            ...prev,
            ...textOnlyFormData
          }));
        }
        
        if (savedEducationData) {
          const parsedEducationData = JSON.parse(savedEducationData);
          // Filter out certificate files
          Object.keys(parsedEducationData).forEach(key => {
            if (parsedEducationData[key].certificate) {
              parsedEducationData[key].certificate = null;
            }
          });
          
          setEducationData(prev => ({
            ...prev,
            ...parsedEducationData
          }));
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    };

    // If we have an employee being edited, use that data
    // Otherwise check for locally saved data
    if (employee) {
      // If employee has firstName and lastName, combine them into fullName
      const updatedEmployee = { ...employee };
      if (employee.firstName && employee.lastName) {
        updatedEmployee.fullName = `${employee.firstName} ${employee.lastName}`;
        delete updatedEmployee.firstName;
        delete updatedEmployee.lastName;
      }
      
      // Handle any file paths as strings by creating file objects or previews
      Object.keys(updatedEmployee).forEach(key => {
        // Skip non-string values or nulls
        if (typeof updatedEmployee[key] !== 'string' || !updatedEmployee[key]) return;
        
        // Check if it's meant to be a file by checking for placeholder text
        if (updatedEmployee[key] === 'file_exists') {
          // It's a file placeholder, but we can't recreate the file
          // We'll just use a placeholder
          updatedEmployee[key] = null;
        } else if (key === 'profilePhoto' && updatedEmployee[key].startsWith('blob:')) {
          // If it's a blob URL for profile photo, create a preview
          setImagePreview(updatedEmployee[key]);
        }
      });
      
      // Process education data similarly
      if (updatedEmployee.education) {
        // Create a complete educationData structure with defaults
        const processedEducation = {
          tenth: {
            rollNo: '',
            cgpa: '',
            schoolName: '',
            schoolAddress: '',
            passoutYear: '',
            certificate: null
          },
          twelfth: {
            rollNo: '',
            cgpa: '',
            schoolName: '',
            schoolAddress: '',
            passoutYear: '',
            certificate: null
          },
          undergraduate: {
            universityName: '',
            uid: '',
            courseBranch: '',
            cgpa: '',
            passoutYear: '',
            certificate: null
          }
        };
        
        // Merge with any existing education data
        Object.keys(updatedEmployee.education).forEach(section => {
          if (updatedEmployee.education[section]) {
            // Certificate handling
            let certificate = updatedEmployee.education[section].certificate;
            if (certificate === 'file_exists') {
              certificate = null;
            }
            
            // Merge the section data
            processedEducation[section] = {
              ...processedEducation[section],
              ...updatedEmployee.education[section],
              certificate
            };
          }
        });
        
        setEducationData(processedEducation);
      }
      
      setFormData(updatedEmployee);
    } else {
      // Load from localStorage only if not editing an existing employee
      loadSavedData();
    }
  }, [employee]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const saveFormData = () => {
      try {
        // Create a version of formData without file objects for storage
        const storableFormData = { ...formData };
        
        // Remove file objects before storing
        Object.keys(storableFormData).forEach(key => {
          if (storableFormData[key] instanceof File) {
            storableFormData[key] = null;
          }
        });
        
        // Create a version of educationData without file objects
        const storableEducationData = JSON.parse(JSON.stringify(educationData));
        Object.keys(storableEducationData).forEach(key => {
          if (storableEducationData[key].certificate) {
            storableEducationData[key].certificate = null;
          }
        });
        
        localStorage.setItem(`${STORAGE_KEY}_form`, JSON.stringify(storableFormData));
        localStorage.setItem(`${STORAGE_KEY}_education`, JSON.stringify(storableEducationData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    };

    // Don't save if we're editing an existing employee
    if (!employee) {
      saveFormData();
    }
  }, [formData, educationData, employee]);

  const validateField = (name, value) => {
    switch (name) {
      case 'companyEmail':
        return !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
          ? 'Invalid email address'
          : '';
      case 'password':
        return value.length < 8
          ? 'Password must be at least 8 characters'
          : !value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
          ? 'Password must contain uppercase, lowercase, number and special character'
          : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      case 'phone':
        return !value.match(/^\d{10}$/) ? 'Invalid phone number' : '';
      case 'employeeId':
        return !value.match(/^[A-Z0-9]{6,}$/)
          ? 'Employee ID must be at least 6 characters (uppercase letters and numbers)'
          : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleImageClick = (image, type) => {
    if (image) {
      // Prevent any default behaviors
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      setModalImage(image);
      setModalType(type);
      setShowImageModal(true);
      
      // Ensure event doesn't propagate to other handlers
      setTimeout(() => {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
          input.blur();
        });
      }, 100);
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        setErrors(prev => ({
          ...prev,
          [type]: IMAGE_ERROR_MESSAGE
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [type]: FILE_SIZE_ERROR
        }));
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      if (type === 'profilePhoto') {
        setImagePreview(imageUrl);
      }
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));
      setErrors(prev => ({
        ...prev,
        [type]: ''
      }));
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        setErrors(prev => ({
          ...prev,
          [field]: IMAGE_ERROR_MESSAGE
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [field]: FILE_SIZE_ERROR
        }));
        return;
      }

      // Clear any previous errors for this field
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));

      // Set the file in formData
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));

      // Open modal for preview
      handleImageClick(file, field);
    }
  };

  const handleCertificateUpload = (section, file) => {
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        setErrors(prev => ({
          ...prev,
          [`${section}Certificate`]: IMAGE_ERROR_MESSAGE
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [`${section}Certificate`]: FILE_SIZE_ERROR
        }));
        return;
      }

      setEducationData(prev => {
        // Ensure the section exists before updating
        const sectionData = prev[section] || {
          rollNo: '',
          cgpa: '',
          schoolName: '',
          schoolAddress: '',
          passoutYear: '',
          certificate: null
        };
        
        return {
          ...prev,
          [section]: {
            ...sectionData,
            certificate: file
          }
        };
      });

      // Open modal for preview
      handleImageClick(file, `${section}Certificate`);
    }
  };

  const handleRemoveCertificate = (section) => {
    setEducationData(prev => {
      // Ensure the section exists before updating
      const sectionData = prev[section] || {
        rollNo: '',
        cgpa: '',
        schoolName: '',
        schoolAddress: '',
        passoutYear: '',
        certificate: null
      };
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          certificate: null
        }
      };
    });
  };

  const handleEducationChange = (section, field, value) => {
    setEducationData(prev => {
      // Ensure the section exists before updating
      const sectionData = prev[section] || {
        rollNo: '',
        cgpa: '',
        schoolName: '',
        schoolAddress: '',
        passoutYear: '',
        certificate: null
      };
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Determine which fields are required based on whether we're editing or creating
    const requiredFields = [
      'employeeId',
      'companyEmail',
      'role',
      'department',
      'fullName',
      'phone',
      'dateOfBirth',
      'gender'
    ];
    
    // Only require password fields when creating a new employee
    if (!employee) {
      requiredFields.push('password', 'confirmPassword');
    }

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      } else {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    // Check required documents
    if (!formData.aadharCard) {
      newErrors.aadharCard = 'Aadhar Card is required';
    }
    
    if (!formData.panCard) {
      newErrors.panCard = 'PAN Card is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updatedData = {
        ...formData,
        // Include education data in the employee object
        education: educationData
      };

      // Always save to localStorage
      const storableFormData = { ...updatedData };
      
      // Handle file objects for storage
      Object.keys(storableFormData).forEach(key => {
        if (storableFormData[key] instanceof File) {
          // For file objects, store a URL representation if possible
          if (key === 'profilePhoto' && storableFormData[key]) {
            storableFormData[key] = URL.createObjectURL(storableFormData[key]);
          } else {
            // For other files, just note that file exists but don't store it
            storableFormData[key] = 'file_exists';
          }
        }
      });
      
      // Handle education certificate files
      if (storableFormData.education) {
        Object.keys(storableFormData.education).forEach(section => {
          if (storableFormData.education[section]?.certificate) {
            storableFormData.education[section].certificate = 'file_exists';
          }
        });
      }

      // Save to localStorage with employee ID as key
      if (updatedData.id) {
        localStorage.setItem(`employee_${updatedData.id}`, JSON.stringify(storableFormData));
      }

      // Update employee in context
      await updateEmployee(employee?.id, updatedData);
      
      // Clear form storage since we've saved the employee data
      localStorage.removeItem(`${STORAGE_KEY}_form`);
      localStorage.removeItem(`${STORAGE_KEY}_education`);
      
      // Always close the overlay after saving
      onClose();
      
      // Only call onSaveComplete if it exists (for view-to-edit transitions)
      if (onSaveComplete) {
        onSaveComplete(updatedData);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setIsSubmitting(false);
    }
  };

  // Helper function to check if a value exists and is not empty
  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (value instanceof File) return true;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  // Helper function to get document display components for read-only mode
  const getDocumentPreview = (document, type, displayName) => {
    if (!document) return null;
    
    return (
      <div 
        className={`${styles.uploadedFilePreview} ${styles.documentPreview}`} 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleImageClick(document, type);
        }}
      >
        <div className={styles.documentIconContainer}>
          <FaImage />
        </div>
        <div className={styles.documentInfo}>
          <span className={styles.documentTitle}>View {displayName}</span>
          <span className={styles.documentHint}>Click to view full document</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>{readOnly ? 'Employee Details' : (employee ? 'Edit Employee Details' : 'Register New Employee')}</h2>
          <div className={styles.headerButtons}>
            {readOnly && (
              <button 
                className={styles.editButton}
                onClick={() => {
                  if (onSaveComplete) {
                    // Tell the parent to switch to edit mode
                    onSaveComplete(formData);
                  }
                }}
                aria-label="Edit employee"
              >
                <FaEdit /> Edit
              </button>
            )}
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close panel"
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Account Details Section */}
          <div className={styles.section}>
            <h3>Account & Credentials Details</h3>
            <div className={styles.formGrid}>
              {(!readOnly || hasValue(formData.employeeId)) && (
                <div className={styles.formGroup}>
                  <label>Employee ID {!readOnly && '*'}</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="e.g., EMP001"
                    required={!readOnly}
                    readOnly={readOnly || !!employee}
                    disabled={readOnly}
                    className={readOnly ? styles.readOnly : ''}
                  />
                  {!readOnly && errors.employeeId && <span className={styles.error}>{errors.employeeId}</span>}
                </div>
              )}
              {(!readOnly || hasValue(formData.companyEmail)) && (
                <div className={styles.formGroup}>
                  <label>Company Email {!readOnly && '*'}</label>
                  <input
                    type="email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                    required={!readOnly}
                    readOnly={readOnly}
                    disabled={readOnly}
                    className={readOnly ? styles.readOnly : ''}
                  />
                  {!readOnly && errors.companyEmail && <span className={styles.error}>{errors.companyEmail}</span>}
                </div>
              )}
              {(!readOnly || hasValue(formData.role)) && (
                <div className={styles.formGroup}>
                  <label>Role {!readOnly && '*'}</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required={!readOnly}
                    disabled={readOnly}
                    className={readOnly ? styles.readOnly : ''}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role.toLowerCase()}>{role}</option>
                    ))}
                  </select>
                  {!readOnly && errors.role && <span className={styles.error}>{errors.role}</span>}
                </div>
              )}
              {(!readOnly || hasValue(formData.department)) && (
                <div className={styles.formGroup}>
                  <label>Department {!readOnly && '*'}</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required={!readOnly}
                    disabled={readOnly}
                    className={readOnly ? styles.readOnly : ''}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept.toLowerCase()}>{dept}</option>
                    ))}
                  </select>
                  {!readOnly && errors.department && <span className={styles.error}>{errors.department}</span>}
                </div>
              )}
              {!employee && !readOnly && (
                <>
                  <div className={styles.formGroup}>
                    <label>Password *</label>
                    <div className={styles.passwordInput}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </button>
                    </div>
                    {errors.password && <span className={styles.error}>{errors.password}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Confirm Password *</label>
                    <div className={styles.passwordInput}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Personal Details Section */}
          {(readOnly || hasValue(formData.profilePhoto) || hasValue(formData.fullName) || hasValue(formData.email) || 
            hasValue(formData.phone) || hasValue(formData.dateOfBirth) || hasValue(formData.gender) || 
            hasValue(formData.nationality) || hasValue(formData.bloodGroup) || hasValue(formData.maritalStatus)) && (
            <div className={styles.section}>
              <h3>Personal Details</h3>
              <div className={styles.formGrid}>
                {(formData.profilePhoto || !readOnly) && (
                  <div className={styles.profileImageContainer}>
                    {formData.profilePhoto ? (
                      <img
                        src={typeof formData.profilePhoto === 'string' 
                          ? formData.profilePhoto 
                          : formData.profilePhoto instanceof File 
                            ? URL.createObjectURL(formData.profilePhoto)
                            : ''}
                        alt="Profile"
                        className={styles.profileImage}
                        onClick={!readOnly ? () => handleImageClick(formData.profilePhoto, 'profilePhoto') : undefined}
                      />
                    ) : (
                      <div 
                        className={styles.profileImage} 
                        style={{ 
                          backgroundColor: 'var(--color-background-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FaCamera size={40} color="var(--color-text-light)" />
                      </div>
                    )}
                    {!readOnly && (
                      <label 
                        htmlFor="profilePhotoInput" 
                        className={styles.reuploadIcon}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaCamera />
                      </label>
                    )}
                    {!readOnly && (
                      <input
                        type="file"
                        id="profilePhotoInput"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => handleImageUpload(e, 'profilePhoto')}
                        style={{ display: 'none' }}
                        disabled={readOnly}
                      />
                    )}
                  </div>
                )}
                {!readOnly && errors.profilePhoto && (
                  <div className={styles.error}>{errors.profilePhoto}</div>
                )}
                {(!readOnly || hasValue(formData.fullName)) && (
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Full Name {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required={!readOnly}
                      placeholder="Enter full name"
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.email)) && (
                  <div className={styles.formGroup}>
                    <label>Personal Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                  </div>
                )}
                {(!readOnly || hasValue(formData.phone)) && (
                  <div className={styles.formGroup}>
                    <label>Phone {!readOnly && '*'}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.phone && <span className={styles.error}>{errors.phone}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.dateOfBirth)) && (
                  <div className={styles.formGroup}>
                    <label>Date of Birth {!readOnly && '*'}</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.dateOfBirth && <span className={styles.error}>{errors.dateOfBirth}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.gender)) && (
                  <div className={styles.formGroup}>
                    <label>Gender {!readOnly && '*'}</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required={!readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {!readOnly && errors.gender && <span className={styles.error}>{errors.gender}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.nationality)) && (
                  <div className={styles.formGroup}>
                    <label>Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                  </div>
                )}
                {(!readOnly || hasValue(formData.bloodGroup)) && (
                  <div className={styles.formGroup}>
                    <label>Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                )}
                {(!readOnly || hasValue(formData.maritalStatus)) && (
                  <div className={styles.formGroup}>
                    <label>Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    >
                      <option value="">Select Marital Status</option>
                      {maritalStatuses.map(status => (
                        <option key={status} value={status.toLowerCase()}>{status}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          {(!readOnly || hasValue(formData.address) || hasValue(formData.city) || hasValue(formData.state) || 
            hasValue(formData.country) || hasValue(formData.postalCode) || hasValue(formData.emergencyContact) || 
            hasValue(formData.emergencyPhone)) && (
            <div className={styles.section}>
              <h3>Contact Information</h3>
              <div className={styles.formGrid}>
                {(!readOnly || hasValue(formData.address)) && (
                  <div className={styles.formGroup}>
                    <label>Address {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.address && <span className={styles.error}>{errors.address}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.city)) && (
                  <div className={styles.formGroup}>
                    <label>City {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.city && <span className={styles.error}>{errors.city}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.state)) && (
                  <div className={styles.formGroup}>
                    <label>State {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.state && <span className={styles.error}>{errors.state}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.country)) && (
                  <div className={styles.formGroup}>
                    <label>Country {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.country && <span className={styles.error}>{errors.country}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.postalCode)) && (
                  <div className={styles.formGroup}>
                    <label>Postal Code {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.emergencyContact)) && (
                  <div className={styles.formGroup}>
                    <label>Emergency Contact Name {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.emergencyContact && <span className={styles.error}>{errors.emergencyContact}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.emergencyPhone)) && (
                  <div className={styles.formGroup}>
                    <label>Emergency Contact Phone {!readOnly && '*'}</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.emergencyPhone && <span className={styles.error}>{errors.emergencyPhone}</span>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education Section */}
          {(!readOnly || 
            (educationData.tenth && Object.values(educationData.tenth).some(v => hasValue(v))) || 
            (educationData.twelfth && Object.values(educationData.twelfth).some(v => hasValue(v))) || 
            (educationData.undergraduate && Object.values(educationData.undergraduate).some(v => hasValue(v)))) && (
            <section className={styles.section}>
              <h3>
                <FaGraduationCap />
                Education Details
              </h3>
              <div className={styles.educationSection}>
                {/* 10th Section */}
                {(!readOnly || (educationData.tenth && Object.values(educationData.tenth).some(v => hasValue(v)))) && (
                  <div className={styles.subsection}>
                    <h4 className={styles.subsectionTitle}>
                      <FaSchool />
                      10th Standard Details
                    </h4>
                    <div className={styles.formGrid}>
                      {(!readOnly || hasValue(educationData.tenth.rollNo)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>Roll No./Board No.</label>
                          <input
                            type="text"
                            value={educationData.tenth.rollNo}
                            onChange={(e) => handleEducationChange('tenth', 'rollNo', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.tenth.cgpa)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>CGPA</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={educationData.tenth.cgpa}
                            onChange={(e) => handleEducationChange('tenth', 'cgpa', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.tenth.schoolName)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>School Name</label>
                          <input
                            type="text"
                            value={educationData.tenth.schoolName}
                            onChange={(e) => handleEducationChange('tenth', 'schoolName', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.tenth.schoolAddress)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>School Address</label>
                          <input
                            type="text"
                            value={educationData.tenth.schoolAddress}
                            onChange={(e) => handleEducationChange('tenth', 'schoolAddress', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.tenth.passoutYear)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>Passout Year</label>
                          <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={educationData.tenth.passoutYear}
                            onChange={(e) => handleEducationChange('tenth', 'passoutYear', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                    </div>
                    
                    {(!readOnly || educationData.tenth.certificate) && (
                      <div className={`${styles.certificateUpload} ${readOnly ? styles.readOnlyCertificates : ''}`}>
                        {!readOnly ? (
                          <label className={styles.fileLabel}>
                            <FaFileUpload />
                            <span>Upload 10th Certificate</span>
                            <input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES}
                              onChange={(e) => handleCertificateUpload('tenth', e.target.files[0])}
                            />
                          </label>
                        ) : (
                          <h5 className={styles.certificateTitle}>Certificate</h5>
                        )}
                        {educationData.tenth.certificate && (
                          <div className={`${styles.uploadedFile} ${readOnly ? styles.readOnlyFile : ''}`}>
                            {getDocumentPreview(educationData.tenth.certificate, 'tenthCertificate', '10th Certificate')}
                            {!readOnly && (
                              <button onClick={() => handleRemoveCertificate('tenth')}>
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 12th Section */}
                {(!readOnly || (educationData.twelfth && Object.values(educationData.twelfth).some(v => hasValue(v)))) && (
                  <div className={styles.subsection}>
                    <h4 className={styles.subsectionTitle}>
                      <FaSchool />
                      12th Standard Details
                    </h4>
                    <div className={styles.formGrid}>
                      {(!readOnly || hasValue(educationData.twelfth?.rollNo)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>Roll No./Board No.</label>
                          <input
                            type="text"
                            value={educationData.twelfth?.rollNo || ''}
                            onChange={(e) => handleEducationChange('twelfth', 'rollNo', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.twelfth?.cgpa)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>CGPA</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={educationData.twelfth?.cgpa || ''}
                            onChange={(e) => handleEducationChange('twelfth', 'cgpa', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.twelfth?.schoolName)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>School Name</label>
                          <input
                            type="text"
                            value={educationData.twelfth?.schoolName || ''}
                            onChange={(e) => handleEducationChange('twelfth', 'schoolName', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.twelfth?.schoolAddress)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>School Address</label>
                          <input
                            type="text"
                            value={educationData.twelfth?.schoolAddress || ''}
                            onChange={(e) => handleEducationChange('twelfth', 'schoolAddress', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.twelfth?.passoutYear)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>Passout Year</label>
                          <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={educationData.twelfth?.passoutYear || ''}
                            onChange={(e) => handleEducationChange('twelfth', 'passoutYear', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                    </div>

                    {(!readOnly || educationData.twelfth?.certificate) && (
                      <div className={`${styles.certificateUpload} ${readOnly ? styles.readOnlyCertificates : ''}`}>
                        {!readOnly ? (
                          <label className={styles.fileLabel}>
                            <FaFileUpload />
                            <span>Upload 12th Certificate</span>
                            <input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES}
                              onChange={(e) => handleCertificateUpload('twelfth', e.target.files[0])}
                            />
                          </label>
                        ) : (
                          <h5 className={styles.certificateTitle}>Certificate</h5>
                        )}
                        {educationData.twelfth?.certificate && (
                          <div className={`${styles.uploadedFile} ${readOnly ? styles.readOnlyFile : ''}`}>
                            {getDocumentPreview(educationData.twelfth.certificate, 'twelfthCertificate', '12th Certificate')}
                            {!readOnly && (
                              <button onClick={() => handleRemoveCertificate('twelfth')}>
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Undergraduate Section */}
                {(!readOnly || (educationData.undergraduate && Object.values(educationData.undergraduate).some(v => hasValue(v)))) && (
                  <div className={styles.subsection}>
                    <h4 className={styles.subsectionTitle}>
                      <FaUniversity />
                      Undergraduate Details
                    </h4>
                    <div className={styles.formGrid}>
                      {(!readOnly || hasValue(educationData.undergraduate.universityName)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>University/Institute Name</label>
                          <input
                            type="text"
                            value={educationData.undergraduate.universityName}
                            onChange={(e) => handleEducationChange('undergraduate', 'universityName', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.undergraduate.uid)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>UID</label>
                          <input
                            type="text"
                            value={educationData.undergraduate.uid}
                            onChange={(e) => handleEducationChange('undergraduate', 'uid', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.undergraduate.courseBranch)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>Course Branch</label>
                          <input
                            type="text"
                            value={educationData.undergraduate.courseBranch}
                            onChange={(e) => handleEducationChange('undergraduate', 'courseBranch', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.undergraduate.cgpa)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>CGPA</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={educationData.undergraduate.cgpa}
                            onChange={(e) => handleEducationChange('undergraduate', 'cgpa', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                      {(!readOnly || hasValue(educationData.undergraduate.passoutYear)) && (
                        <div className={styles.formGroup}>
                          <label className={readOnly ? '' : styles.required}>Passout Year</label>
                          <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear() + 4}
                            value={educationData.undergraduate.passoutYear}
                            onChange={(e) => handleEducationChange('undergraduate', 'passoutYear', e.target.value)}
                            required={!readOnly}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={readOnly ? styles.readOnly : ''}
                          />
                        </div>
                      )}
                    </div>

                    {(!readOnly || educationData.undergraduate.certificate) && (
                      <div className={`${styles.certificateUpload} ${readOnly ? styles.readOnlyCertificates : ''}`}>
                        {!readOnly ? (
                          <label className={styles.fileLabel}>
                            <FaFileUpload />
                            <span>Upload Undergraduate Certificate</span>
                            <input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES}
                              onChange={(e) => handleCertificateUpload('undergraduate', e.target.files[0])}
                            />
                          </label>
                        ) : (
                          <h5 className={styles.certificateTitle}>Certificate</h5>
                        )}
                        {educationData.undergraduate.certificate && (
                          <div className={`${styles.uploadedFile} ${readOnly ? styles.readOnlyFile : ''}`}>
                            {getDocumentPreview(educationData.undergraduate.certificate, 'undergraduateCertificate', 'Undergraduate Certificate')}
                            {!readOnly && (
                              <button onClick={() => handleRemoveCertificate('undergraduate')}>
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Bank Details Section */}
          {(!readOnly || hasValue(formData.bankName) || hasValue(formData.accountNumber) || 
            hasValue(formData.ifscCode) || hasValue(formData.accountType)) && (
            <div className={styles.section}>
              <h3>Bank Details</h3>
              <div className={styles.formGrid}>
                {(!readOnly || hasValue(formData.bankName)) && (
                  <div className={styles.formGroup}>
                    <label>Bank Name {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.bankName && <span className={styles.error}>{errors.bankName}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.accountNumber)) && (
                  <div className={styles.formGroup}>
                    <label>Account Number {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.accountNumber && <span className={styles.error}>{errors.accountNumber}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.ifscCode)) && (
                  <div className={styles.formGroup}>
                    <label>IFSC Code {!readOnly && '*'}</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      required={!readOnly}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    />
                    {!readOnly && errors.ifscCode && <span className={styles.error}>{errors.ifscCode}</span>}
                  </div>
                )}
                {(!readOnly || hasValue(formData.accountType)) && (
                  <div className={styles.formGroup}>
                    <label>Account Type {!readOnly && '*'}</label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleInputChange}
                      required={!readOnly}
                      disabled={readOnly}
                      className={readOnly ? styles.readOnly : ''}
                    >
                      <option value="">Select Account Type</option>
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                      <option value="salary">Salary</option>
                    </select>
                    {!readOnly && errors.accountType && <span className={styles.error}>{errors.accountType}</span>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Identity Documents Section */}
          {(!readOnly || hasValue(formData.aadharCard) || hasValue(formData.panCard) || hasValue(formData.passport) || 
            hasValue(formData.drivingLicense) || hasValue(formData.voterId)) && (
            <div className={styles.section}>
              <h3>Identity Documents</h3>
              {readOnly ? (
                // Read-only mode - document grid layout
                <div className={styles.documentsGrid}>
                  {['aadharCard', 'panCard', 'passport', 'drivingLicense', 'voterId'].map((doc) => {
                    // Format display name
                    const displayName = doc.charAt(0).toUpperCase() + doc.slice(1).replace(/([A-Z])/g, ' $1');
                    
                    return hasValue(formData[doc]) && (
                      <div key={doc} className={styles.documentContainer}>
                        <h4>{displayName}</h4>
                        {getDocumentPreview(formData[doc], doc, displayName)}
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Edit mode - original form grid layout
                <div className={styles.formGrid}>
                  {['aadharCard', 'panCard', 'passport', 'drivingLicense', 'voterId'].map((doc) => {
                    // Format display name
                    const displayName = doc.charAt(0).toUpperCase() + doc.slice(1).replace(/([A-Z])/g, ' $1');
                    const isRequired = !readOnly && (doc === 'aadharCard' || doc === 'panCard');
                    
                    return (
                      <div key={doc} className={styles.formGroup}>
                        <label>
                          {displayName} {isRequired && '*'}
                        </label>
                        
                        <div className={styles.fileInput}>
                          <input
                            type="file"
                            id={doc}
                            accept={ACCEPTED_IMAGE_TYPES}
                            onChange={(e) => handleFileUpload(e, doc)}
                            required={isRequired && !formData[doc]}
                            onClick={(e) => {
                              // Only allow clicks if there's no document yet or if clicking directly on the input
                              if (formData[doc] && e.target === e.currentTarget) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                            }}
                          />
                          <label htmlFor={doc} className={styles.fileLabel}>
                            {formData[doc] ? (
                              <div 
                                className={styles.uploadedFilePreview} 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleImageClick(formData[doc], doc);
                                }}
                              >
                                <FaImage />
                                <span>View Uploaded {displayName}</span>
                              </div>
                            ) : (
                              <>
                                <AiOutlineUpload />
                                <span>Upload {displayName}</span>
                              </>
                            )}
                          </label>
                          {errors[doc] && <span className={styles.error}>{errors[doc]}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Form Actions - only show if not in readOnly mode */}
          {!readOnly && (
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>

        {/* Image Modal */}
        {showImageModal && (
          <div className={styles.imageModal} onClick={() => setShowImageModal(false)}>
            <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{modalType.replace(/([A-Z])/g, ' $1').replace(/Certificate/g, ' Certificate').trim()}</h3>
                <button 
                  className={styles.modalClose} 
                  onClick={() => setShowImageModal(false)}
                  aria-label="Close modal"
                >
                  <AiOutlineClose />
                </button>
              </div>
              
              {modalImage && (
                <div className={styles.modalImageContainer}>
                  <img
                    src={typeof modalImage === 'string' 
                      ? modalImage 
                      : modalImage instanceof File 
                        ? URL.createObjectURL(modalImage)
                        : ''}
                    alt={`${modalType} Preview`}
                    className={styles.modalImage}
                  />
                </div>
              )}
              
              {!readOnly && (
                <div className={styles.modalActions}>
                  <label className={styles.modalButton}>
                    <FaEdit />
                    Change Image
                    <input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        if (modalType.includes('Certificate')) {
                          handleCertificateUpload(modalType.replace('Certificate', ''), file);
                        } else {
                          handleFileUpload(e, modalType);
                        }
                        setShowImageModal(false);
                      }}
                      style={{ display: 'none' }}
                      disabled={readOnly}
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.modalButton}
                    onClick={() => {
                      // Trigger the file input
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = ACCEPTED_IMAGE_TYPES;
                      fileInput.onchange = (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        if (modalType.includes('Certificate')) {
                          handleCertificateUpload(modalType.replace('Certificate', ''), file);
                        } else {
                          handleFileUpload(e, modalType);
                        }
                        setShowImageModal(false);
                      };
                      fileInput.click();
                    }}
                  >
                    <FaUpload />
                    Reupload
                  </button>
                </div>
              )}
              
              {readOnly && (
                <div className={styles.modalInfo}>
                  <div className={styles.documentDetails}>
                    <h4>Document Information</h4>
                    <p>
                      <strong>Document Type:</strong> {modalType.replace(/([A-Z])/g, ' $1').replace(/Certificate/g, ' Certificate').trim()}
                    </p>
                    {modalImage instanceof File && (
                      <>
                        <p><strong>File Name:</strong> {modalImage.name}</p>
                        <p><strong>File Size:</strong> {(modalImage.size / 1024).toFixed(2)} KB</p>
                        <p><strong>Upload Date:</strong> {new Date().toLocaleDateString()}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditEmployeePanel; 