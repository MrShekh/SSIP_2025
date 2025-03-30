import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaGraduationCap, FaSchool, FaUniversity, FaEdit, FaImage } from 'react-icons/fa';
import styles from './EditEmployeePanel.module.css';

const ViewEmployeePanel = ({ employee, onClose, onEdit }) => {
  // Function to check if a field has data
  const hasData = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'object') return value !== null;
    return true;
  };

  // Group education data for display
  const educationSections = [
    {
      title: '10th Standard Details',
      icon: <FaSchool />,
      data: employee?.education?.tenth,
      fields: [
        { label: 'Roll No./Board No.', key: 'rollNo' },
        { label: 'CGPA', key: 'cgpa' },
        { label: 'School Name', key: 'schoolName' },
        { label: 'School Address', key: 'schoolAddress' },
        { label: 'Passout Year', key: 'passoutYear' },
      ],
      certificate: employee?.education?.tenth?.certificate
    },
    {
      title: '12th Standard Details',
      icon: <FaSchool />,
      data: employee?.education?.twelfth,
      fields: [
        { label: 'Roll No./Board No.', key: 'rollNo' },
        { label: 'CGPA', key: 'cgpa' },
        { label: 'School Name', key: 'schoolName' },
        { label: 'School Address', key: 'schoolAddress' },
        { label: 'Passout Year', key: 'passoutYear' },
      ],
      certificate: employee?.education?.twelfth?.certificate
    },
    {
      title: 'Undergraduate Details',
      icon: <FaUniversity />,
      data: employee?.education?.undergraduate,
      fields: [
        { label: 'University/Institute Name', key: 'universityName' },
        { label: 'UID', key: 'uid' },
        { label: 'Course Branch', key: 'courseBranch' },
        { label: 'CGPA', key: 'cgpa' },
        { label: 'Passout Year', key: 'passoutYear' },
      ],
      certificate: employee?.education?.undergraduate?.certificate
    }
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Employee Details</h2>
          <div className={styles.headerButtons}>
            <button 
              className={styles.editButton}
              onClick={onEdit}
              aria-label="Edit employee"
            >
              <FaEdit /> Edit
            </button>
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close panel"
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>

        {/* Account Details Section */}
        {hasData(employee?.employeeId) && (
          <div className={styles.section}>
            <h3>Account & Credentials Details</h3>
            <div className={styles.formGrid}>
              {hasData(employee?.employeeId) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Employee ID</span>
                  <span className={styles.viewValue}>{employee.employeeId}</span>
                </div>
              )}
              {hasData(employee?.companyEmail) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Company Email</span>
                  <span className={styles.viewValue}>{employee.companyEmail}</span>
                </div>
              )}
              {hasData(employee?.role) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Role</span>
                  <span className={styles.viewValue}>{employee.role}</span>
                </div>
              )}
              {hasData(employee?.department) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Department</span>
                  <span className={styles.viewValue}>{employee.department}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Personal Details Section */}
        <div className={styles.section}>
          <h3>Personal Details</h3>
          <div className={styles.formGrid}>
            {hasData(employee?.profilePhoto) && (
              <div className={styles.profileImageContainer}>
                <img
                  src={typeof employee.profilePhoto === 'string' ? employee.profilePhoto : URL.createObjectURL(employee.profilePhoto)}
                  alt="Profile"
                  className={styles.profileImage}
                />
              </div>
            )}
            
            {hasData(employee?.fullName || (employee?.firstName && employee?.lastName)) && (
              <div className={`${styles.viewField} ${styles.fullWidth}`}>
                <span className={styles.viewLabel}>Full Name</span>
                <span className={styles.viewValue}>
                  {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                </span>
              </div>
            )}
            
            {hasData(employee?.email) && (
              <div className={styles.viewField}>
                <span className={styles.viewLabel}>Personal Email</span>
                <span className={styles.viewValue}>{employee.email}</span>
              </div>
            )}
            
            {hasData(employee?.phone) && (
              <div className={styles.viewField}>
                <span className={styles.viewLabel}>Phone</span>
                <span className={styles.viewValue}>{employee.phone}</span>
              </div>
            )}
            
            {hasData(employee?.dateOfBirth) && (
              <div className={styles.viewField}>
                <span className={styles.viewLabel}>Date of Birth</span>
                <span className={styles.viewValue}>{employee.dateOfBirth}</span>
              </div>
            )}
            
            {hasData(employee?.gender) && (
              <div className={styles.viewField}>
                <span className={styles.viewLabel}>Gender</span>
                <span className={styles.viewValue}>{employee.gender}</span>
              </div>
            )}
            
            {hasData(employee?.nationality) && (
              <div className={styles.viewField}>
                <span className={styles.viewLabel}>Nationality</span>
                <span className={styles.viewValue}>{employee.nationality}</span>
              </div>
            )}
            
            {hasData(employee?.bloodGroup) && (
              <div className={styles.viewField}>
                <span className={styles.viewLabel}>Blood Group</span>
                <span className={styles.viewValue}>{employee.bloodGroup}</span>
              </div>
            )}
            
            {hasData(employee?.maritalStatus) && (
              <div className={styles.viewField}>
                <span className={styles.viewLabel}>Marital Status</span>
                <span className={styles.viewValue}>{employee.maritalStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Section */}
        {(hasData(employee?.address) || hasData(employee?.city) || 
          hasData(employee?.state) || hasData(employee?.country) || 
          hasData(employee?.postalCode) || hasData(employee?.emergencyContact) || 
          hasData(employee?.emergencyPhone)) && (
          <div className={styles.section}>
            <h3>Contact Information</h3>
            <div className={styles.formGrid}>
              {hasData(employee?.address) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Address</span>
                  <span className={styles.viewValue}>{employee.address}</span>
                </div>
              )}
              {hasData(employee?.city) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>City</span>
                  <span className={styles.viewValue}>{employee.city}</span>
                </div>
              )}
              {hasData(employee?.state) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>State</span>
                  <span className={styles.viewValue}>{employee.state}</span>
                </div>
              )}
              {hasData(employee?.country) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Country</span>
                  <span className={styles.viewValue}>{employee.country}</span>
                </div>
              )}
              {hasData(employee?.postalCode) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Postal Code</span>
                  <span className={styles.viewValue}>{employee.postalCode}</span>
                </div>
              )}
              {hasData(employee?.emergencyContact) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Emergency Contact Name</span>
                  <span className={styles.viewValue}>{employee.emergencyContact}</span>
                </div>
              )}
              {hasData(employee?.emergencyPhone) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Emergency Contact Phone</span>
                  <span className={styles.viewValue}>{employee.emergencyPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education Section */}
        {educationSections.some(section => section.data && Object.values(section.data).some(v => hasData(v))) && (
          <div className={styles.section}>
            <h3>
              <FaGraduationCap />
              Education Details
            </h3>
            <div className={styles.educationSection}>
              {educationSections.map((section, idx) => (
                section.data && Object.values(section.data).some(v => hasData(v)) ? (
                  <div key={idx} className={styles.subsection}>
                    <h4 className={styles.subsectionTitle}>
                      {section.icon}
                      {section.title}
                    </h4>
                    <div className={styles.formGrid}>
                      {section.fields.map((field, fieldIdx) => (
                        hasData(section.data[field.key]) && (
                          <div key={fieldIdx} className={styles.viewField}>
                            <span className={styles.viewLabel}>{field.label}</span>
                            <span className={styles.viewValue}>{section.data[field.key]}</span>
                          </div>
                        )
                      ))}
                    </div>
                    {hasData(section.certificate) && (
                      <div className={styles.certificateView}>
                        <span className={styles.viewLabel}>Certificate</span>
                        <div className={styles.certificatePreview}>
                          <FaImage />
                          <span>Certificate Available</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          </div>
        )}

        {/* Bank Details Section */}
        {(hasData(employee?.bankName) || hasData(employee?.accountNumber) || 
          hasData(employee?.ifscCode) || hasData(employee?.accountType)) && (
          <div className={styles.section}>
            <h3>Bank Details</h3>
            <div className={styles.formGrid}>
              {hasData(employee?.bankName) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Bank Name</span>
                  <span className={styles.viewValue}>{employee.bankName}</span>
                </div>
              )}
              {hasData(employee?.accountNumber) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Account Number</span>
                  <span className={styles.viewValue}>{employee.accountNumber}</span>
                </div>
              )}
              {hasData(employee?.ifscCode) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>IFSC Code</span>
                  <span className={styles.viewValue}>{employee.ifscCode}</span>
                </div>
              )}
              {hasData(employee?.accountType) && (
                <div className={styles.viewField}>
                  <span className={styles.viewLabel}>Account Type</span>
                  <span className={styles.viewValue}>{employee.accountType}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Identity Documents Section */}
        {(hasData(employee?.aadharCard) || hasData(employee?.panCard) || 
          hasData(employee?.passport) || hasData(employee?.drivingLicense) || 
          hasData(employee?.voterId)) && (
          <div className={styles.section}>
            <h3>Identity Documents</h3>
            <div className={styles.formGrid}>
              {[
                { label: 'Aadhar Card', key: 'aadharCard' },
                { label: 'PAN Card', key: 'panCard' },
                { label: 'Passport', key: 'passport' },
                { label: 'Driving License', key: 'drivingLicense' },
                { label: 'Voter ID', key: 'voterId' }
              ].map((doc, idx) => (
                hasData(employee[doc.key]) && (
                  <div key={idx} className={styles.viewField}>
                    <span className={styles.viewLabel}>{doc.label}</span>
                    <div className={styles.documentPreview}>
                      <FaImage />
                      <span>Document Available</span>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEmployeePanel; 