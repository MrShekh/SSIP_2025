import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const EmployeeContext = createContext();

export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  // Load employees from localStorage on mount
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      try {
        const parsedEmployees = JSON.parse(storedEmployees);
        
        // Check for individual employee storage for updates
        const updatedEmployees = parsedEmployees.map(employee => {
          const individualStorage = localStorage.getItem(`employee_${employee.id}`);
          if (individualStorage) {
            try {
              // Merge with individual storage data which might be more recent
              return { ...employee, ...JSON.parse(individualStorage) };
            } catch (error) {
              console.error(`Error parsing individual storage for employee ${employee.id}:`, error);
              return employee;
            }
          }
          return employee;
        });
        
        setEmployees(updatedEmployees);
      } catch (error) {
        console.error('Error loading employees from storage:', error);
      }
    }
  }, []);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    try {
      // Create a version without file objects
      const storableEmployees = employees.map(employee => {
        const employeeCopy = { ...employee };
        
        // Remove file objects before storing
        Object.keys(employeeCopy).forEach(key => {
          if (employeeCopy[key] instanceof File) {
            // Store file name instead of the file itself
            employeeCopy[key] = employeeCopy[key].name;
          }
        });
        
        // Handle education data similarly
        if (employeeCopy.education) {
          Object.keys(employeeCopy.education).forEach(level => {
            if (employeeCopy.education[level]?.certificate instanceof File) {
              employeeCopy.education[level].certificate = employeeCopy.education[level].certificate.name;
            }
          });
        }
        
        return employeeCopy;
      });
      
      localStorage.setItem('employees', JSON.stringify(storableEmployees));
    } catch (error) {
      console.error('Error saving employees to storage:', error);
    }
  }, [employees]);

  // Get employee by ID with merged localStorage data if available
  const getEmployeeById = useCallback((id) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return null;
    
    // Check if we have updated data in individual storage
    const individualStorage = localStorage.getItem(`employee_${id}`);
    if (individualStorage) {
      try {
        return { ...employee, ...JSON.parse(individualStorage) };
      } catch (error) {
        console.error(`Error parsing individual storage for employee ${id}:`, error);
      }
    }
    
    return employee;
  }, [employees]);

  // Add a new employee
  const addEmployee = useCallback((employeeData) => {
    const newEmployee = {
      id: Date.now().toString(),
      ...employeeData,
      education: employeeData.education || {
        tenth: employeeData.tenth || null,
        twelfth: employeeData.twelfth || null,
        undergraduate: employeeData.undergraduate || null
      }
    };
    
    setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
    
    // Also save to individual storage
    try {
      localStorage.setItem(`employee_${newEmployee.id}`, JSON.stringify(newEmployee));
    } catch (error) {
      console.error('Error saving new employee to individual storage:', error);
    }
    
    return newEmployee;
  }, []);

  // Update an existing employee
  const updateEmployee = useCallback((id, employeeData) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(employee => 
        employee.id === id ? { ...employee, ...employeeData } : employee
      )
    );
    
    // Update individual storage
    try {
      const updatedEmployee = { ...getEmployeeById(id), ...employeeData };
      localStorage.setItem(`employee_${id}`, JSON.stringify(updatedEmployee));
      return updatedEmployee;
    } catch (error) {
      console.error(`Error updating employee ${id} in individual storage:`, error);
      return null;
    }
  }, [getEmployeeById]);

  // Delete an employee
  const deleteEmployee = useCallback((id) => {
    setEmployees(prevEmployees => 
      prevEmployees.filter(employee => employee.id !== id)
    );
    
    // Remove from individual storage
    localStorage.removeItem(`employee_${id}`);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    employees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
  }), [employees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee]);

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider; 