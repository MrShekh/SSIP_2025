import * as XLSX from 'xlsx';

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (amount) => {
  if (!amount) return '-';
  return `₹${amount.toLocaleString()}`;
};

export const exportToExcel = (data, types, filters) => {
  // Prepare headers based on selected report types
  const headers = ['Employee Name', 'Department'];
  
  if (types.includes('employee')) {
    headers.push('Employment Status', 'Role', 'Work Location');
  }
  if (types.includes('attendance')) {
    headers.push('Attendance Date', 'Check In', 'Check Out', 'Work Hours', 'Status');
  }
  if (types.includes('payroll')) {
    headers.push('Net Salary', 'Base Pay', 'Overtime', 'Allowances', 'Deductions');
  }
  if (types.includes('leave')) {
    headers.push('Leave Type', 'Start Date', 'End Date', 'Status', 'Approving Manager');
  }

  // Transform data for Excel
  const excelData = data.map(employee => {
    const row = [
      employee.name,
      employee.department
    ];

    if (types.includes('employee')) {
      const empDetails = employee.reports.employee || {};
      row.push(
        empDetails.employmentStatus || '-',
        empDetails.designation || '-',
        empDetails.workLocation || '-'
      );
    }

    if (types.includes('attendance')) {
      const attDetails = employee.reports.attendance || {};
      row.push(
        formatDate(attDetails.date),
        attDetails.checkIn || '-',
        attDetails.checkOut || '-',
        attDetails.workHours || '-',
        attDetails.status || '-'
      );
    }

    if (types.includes('payroll')) {
      const payDetails = employee.reports.payroll || {};
      row.push(
        formatCurrency(payDetails.netSalary),
        formatCurrency(payDetails.basePay),
        formatCurrency(payDetails.overtime),
        formatCurrency(payDetails.allowances),
        formatCurrency(payDetails.deductions)
      );
    }

    if (types.includes('leave')) {
      const leaveDetails = employee.reports.leave || {};
      row.push(
        leaveDetails.leaveType || '-',
        formatDate(leaveDetails.startDate),
        formatDate(leaveDetails.endDate),
        leaveDetails.status || '-',
        leaveDetails.approvingManager || '-'
      );
    }

    return row;
  });

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData]);

  // Set column widths
  const colWidths = headers.map(() => ({ wch: 15 }));
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  // Generate filename with filters
  let filename = 'Report';
  if (filters.department && filters.department !== 'all') {
    filename += `_${filters.department}`;
  }
  if (filters.status && filters.status.length > 0) {
    filename += `_${filters.status.join('_')}`;
  }
  filename += '_' + new Date().toISOString().split('T')[0];
  filename += '.xlsx';

  // Save file
  XLSX.writeFile(wb, filename);
}; 