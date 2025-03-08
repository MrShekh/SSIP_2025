import * as XLSX from 'xlsx';

// Generate random time between 8:00 AM and 10:00 AM
const generateRandomTime = () => {
  const hour = Math.floor(Math.random() * 2) + 8; // 8-9
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Generate random date within a range
const generateRandomDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
};

const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Operations', 'Finance', 'IT', 'Customer Support'];
const statuses = ['Present', 'Late', 'Absent'];
const names = [
  'John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 'James Johnson',
  'Lisa Anderson', 'David Martinez', 'Jennifer Taylor', 'Robert Thomas', 'Maria Garcia',
  'William White', 'Elizabeth Lee', 'Joseph Harris', 'Margaret Martin', 'Charles Thompson',
  'Sandra Robinson', 'Daniel Lewis', 'Nancy Walker', 'Kevin Hall', 'Betty Young',
  'Christopher King', 'Susan Wright', 'Thomas Scott', 'Jessica Green', 'Brian Adams'
];

// Generate dummy attendance data
const generateDummyData = (startDate, endDate) => {
  const data = [];
  const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
  
  // Generate 150 rows of data
  for (let i = 0; i < 150; i++) {
    const name = names[i % names.length];
    const date = generateRandomDate(startDate, endDate);
    const department = departments[Math.floor(Math.random() * departments.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const checkIn = status !== 'Absent' ? generateRandomTime() : '-';
    const checkOut = status !== 'Absent' ? '17:00' : '-';
    
    data.push({
      'Employee ID': `EMP${(i + 1).toString().padStart(3, '0')}`,
      'Name': name,
      'Department': department,
      'Date': date,
      'Status': status,
      'Check In': checkIn,
      'Check Out': checkOut,
      'Working Hours': status !== 'Absent' ? '8:00' : '0:00',
      'Late By': status === 'Late' ? '30 mins' : '-',
      'Notes': status === 'Absent' ? 'Leave Applied' : 
               status === 'Late' ? 'Traffic Delay' : ''
    });
  }
  
  return data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
};

// Generate report data for charts and visualizations
export const generateReportData = (startDate, endDate) => {
  const data = generateDummyData(startDate, endDate);
  
  return {
    attendanceData: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      datasets: [
        {
          label: 'Present',
          data: [42, 45, 43, 44, 41],
          backgroundColor: '#4CAF50',
        },
        {
          label: 'Absent',
          data: [3, 2, 4, 1, 4],
          backgroundColor: '#f44336',
        },
        {
          label: 'Late',
          data: [2, 1, 1, 3, 2],
          backgroundColor: '#FFC107',
        },
      ],
    },
    summaryStats: {
      totalEmployees: 48,
      averageAttendance: 89.5,
      onTimeRate: 95.2,
      lateArrivals: 9,
      absences: 14,
    },
    departmentData: {
      labels: departments,
      datasets: [{
        data: departments.map(() => Math.floor(Math.random() * 20) + 80), // 80-100%
        backgroundColor: [
          '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', 
          '#FF5722', '#607D8B', '#795548', '#00BCD4'
        ],
      }],
    },
    rawData: data
  };
};

export const exportReportToExcel = (data, startDate, endDate) => {
  const worksheet = XLSX.utils.json_to_sheet(data.rawData);
  
  // Set column widths
  const columnWidths = [
    { wch: 12 },  // Employee ID
    { wch: 20 },  // Name
    { wch: 15 },  // Department
    { wch: 12 },  // Date
    { wch: 10 },  // Status
    { wch: 10 },  // Check In
    { wch: 10 },  // Check Out
    { wch: 12 },  // Working Hours
    { wch: 10 },  // Late By
    { wch: 20 },  // Notes
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

  // Generate Excel file
  const fileName = `attendance_report_${startDate}_to_${endDate}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  
  return fileName;
};

export const exportReportToCSV = (data) => {
  // Implementation for CSV export
  const csvContent = [
    ['Date', 'Present', 'Absent', 'Late'],
    ...data.attendanceData.labels.map((date, index) => [
      date,
      data.attendanceData.datasets[0].data[index],
      data.attendanceData.datasets[1].data[index],
      data.attendanceData.datasets[2].data[index],
    ]),
  ].map(row => row.join(',')).join('\n');

  return csvContent;
};

export const exportReportToPDF = (data) => {
  // Mock PDF export function
  console.log('Exporting to PDF:', data);
  return 'PDF export functionality will be implemented here';
};

export const getReportFilters = () => {
  return {
    departments: ['All', ...departments],
    status: ['All', ...statuses],
    dateRanges: ['Today', 'This Week', 'This Month', 'Custom'],
  };
};
