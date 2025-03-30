// Helper function to generate random data
const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Engineering', 'Legal'];
const designations = ['Manager', 'Senior Developer', 'Junior Developer', 'Analyst', 'Executive', 'Lead', 'Associate', 'Director'];
const locations = ['Remote', 'Office', 'Hybrid'];
const leaveTypes = ['Sick Leave', 'Vacation', 'Personal Leave', 'Family Emergency', 'Study Leave'];
const statuses = ['Approved', 'Pending', 'Rejected'];
const attendanceStatuses = ['Present', 'Late', 'Absent', 'Early Leave', 'Remote Work'];

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 4) + 8; // 8 AM to 11 AM
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Generate Employee Data
export const employeeData = Array.from({ length: 55 }, (_, index) => {
  const deptIndex = index % departments.length;
  return {
    id: `EMP${(index + 1).toString().padStart(3, '0')}`,
    name: `Employee ${index + 1}`,
    contact: `98765${(43210 + index).toString().padStart(5, '0')}`,
    department: departments[deptIndex],
    designation: designations[Math.floor(Math.random() * designations.length)],
    employmentStatus: 'Active',
    workLocation: locations[Math.floor(Math.random() * locations.length)],
    email: `employee${index + 1}@company.com`,
    joinDate: generateRandomDate(new Date('2023-01-01'), new Date())
  };
});

// Generate Attendance Data
export const attendanceData = Array.from({ length: 60 }, (_, index) => {
  const employeeIndex = index % employeeData.length;
  const employee = employeeData[employeeIndex];
  const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
  const checkIn = generateRandomTime();
  const checkOutHour = parseInt(checkIn.split(':')[0]) + 8;
  const checkOut = `${checkOutHour}:${checkIn.split(':')[1]}`;

  return {
    date: generateRandomDate(new Date('2024-01-01'), new Date()),
    employeeId: employee.id,
    employeeName: employee.name,
    checkIn,
    checkOut,
    workHours: 8,
    status,
    location: employee.workLocation,
    department: employee.department
  };
});

// Generate Payroll Data
export const payrollData = Array.from({ length: 55 }, (_, index) => {
  const employee = employeeData[index % employeeData.length];
  const basePay = Math.floor(Math.random() * 50000) + 30000;
  const overtime = Math.floor(Math.random() * 5000);
  const allowances = Math.floor(Math.random() * 8000);
  const deductions = Math.floor(Math.random() * 3000);

  return {
    month: 'March 2024',
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    basePay,
    overtime,
    allowances,
    deductions,
    netSalary: basePay + overtime + allowances - deductions,
    paymentStatus: Math.random() > 0.3 ? 'Processed' : 'Pending'
  };
});

// Generate Leave Data
export const leaveData = Array.from({ length: 50 }, (_, index) => {
  const employee = employeeData[index % employeeData.length];
  const startDate = generateRandomDate(new Date('2024-01-01'), new Date('2024-12-31'));
  const endDate = generateRandomDate(new Date(startDate), new Date('2024-12-31'));

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
    startDate,
    endDate,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    approvingManager: `Manager ${Math.floor(Math.random() * 5) + 1}`,
    reason: 'Personal reasons'
  };
});

export const statusFilters = [
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late' },
  { value: 'absent', label: 'Absent' },
  { value: 'early_leave', label: 'Early Leave' },
  { value: 'remote_work', label: 'Remote Work' }
]; 