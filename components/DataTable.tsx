
import React, { useState } from 'react';
import { ExamRecord } from '../types';

interface DataTableProps {
  data: ExamRecord[];
  onReset: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(record => 
    Object.values(record).some(val => 
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleExport = () => {
    const headers = ["Sl.no", "Exam Date", "Batch", "Subject Code", "Subject Name", "Register Number", "Student Name"];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.slNo,
        `"${row.examDate}"`,
        `"${row.batch}"`,
        `"${row.subjectCode}"`,
        `"${row.subjectName}"`,
        `"${row.registerNumber}"`,
        `"${row.studentName}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "exam_data.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search records..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Clear Data
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sl.no</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Register No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredData.length > 0 ? (
                filteredData.map((record, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{record.slNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{record.examDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{record.batch}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-indigo-600">{record.subjectCode}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{record.subjectName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{record.registerNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 uppercase">{record.studentName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    {searchTerm ? "No matching records found." : "No records extracted yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-right text-xs text-slate-400 font-medium">
        Total Records: {filteredData.length}
      </div>
    </div>
  );
};

export default DataTable;
