import React, { useState } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet, FileText, X } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export default function ExportImport({ tasks, onImport, onClose }) {
    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState('');

    // Export to JSON
    const exportToJSON = () => {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `daily-todo-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Export to CSV
    const exportToCSV = () => {
        const csvData = [];

        // Add headers
        csvData.push(['Date', 'Time', 'Task', 'Completed']);

        // Add tasks
        Object.keys(tasks).sort().forEach(date => {
            tasks[date].forEach(task => {
                csvData.push([
                    date,
                    task.time,
                    task.text,
                    task.completed ? 'Yes' : 'No'
                ]);
            });
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `daily-todo-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setTextColor(147, 51, 234); // Purple color
        doc.text('Daily Todo App - Task Export', 14, 20);

        // Add export date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 28);

        // Prepare table data
        const tableData = [];
        Object.keys(tasks).sort().forEach(date => {
            tasks[date].forEach(task => {
                tableData.push([
                    date,
                    task.time,
                    task.text,
                    task.completed ? '✓' : '○'
                ]);
            });
        });

        // Add table
        doc.autoTable({
            startY: 35,
            head: [['Date', 'Time', 'Task', 'Status']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [147, 51, 234], // Purple
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 243, 255] // Light purple
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 20 },
                2: { cellWidth: 110 },
                3: { cellWidth: 15, halign: 'center' }
            }
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save(`daily-todo-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Import from JSON
    const handleJSONImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImporting(true);
        setImportError('');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                // Validate data structure
                if (typeof importedData !== 'object') {
                    throw new Error('Invalid data format');
                }

                // Validate each date's tasks
                Object.keys(importedData).forEach(date => {
                    if (!Array.isArray(importedData[date])) {
                        throw new Error(`Invalid tasks for date: ${date}`);
                    }
                    importedData[date].forEach(task => {
                        if (!task.id || !task.text || !task.time) {
                            throw new Error('Invalid task structure');
                        }
                    });
                });

                onImport(importedData);
                setImporting(false);
                onClose();
            } catch (error) {
                setImportError(`Failed to import: ${error.message}`);
                setImporting(false);
            }
        };
        reader.readAsText(file);
    };

    // Import from CSV
    const handleCSVImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImporting(true);
        setImportError('');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const parsed = Papa.parse(csv, { header: true });

                if (parsed.errors.length > 0) {
                    throw new Error('CSV parsing error');
                }

                const importedTasks = {};

                parsed.data.forEach((row, index) => {
                    if (!row.Date || !row.Time || !row.Task) {
                        return; // Skip invalid rows
                    }

                    const date = row.Date;
                    if (!importedTasks[date]) {
                        importedTasks[date] = [];
                    }

                    importedTasks[date].push({
                        id: Date.now() + index,
                        text: row.Task,
                        time: row.Time,
                        completed: row.Completed === 'Yes' || row.Completed === 'true'
                    });
                });

                // Sort tasks by time for each date
                Object.keys(importedTasks).forEach(date => {
                    importedTasks[date].sort((a, b) => a.time.localeCompare(b.time));
                });

                onImport(importedTasks);
                setImporting(false);
                onClose();
            } catch (error) {
                setImportError(`Failed to import CSV: ${error.message}`);
                setImporting(false);
            }
        };
        reader.readAsText(file);
    };

    const taskCount = Object.values(tasks).reduce((sum, dayTasks) => sum + dayTasks.length, 0);
    const dateCount = Object.keys(tasks).length;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Export & Import
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {taskCount} tasks across {dateCount} days
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Export Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Download size={20} className="text-purple-600" />
                            Export Your Tasks
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* JSON Export */}
                            <button
                                onClick={exportToJSON}
                                className="flex flex-col items-center gap-3 p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all group"
                            >
                                <FileJson size={32} className="text-purple-600 group-hover:scale-110 transition-transform" />
                                <div className="text-center">
                                    <div className="font-semibold text-gray-800">JSON</div>
                                    <div className="text-xs text-gray-500">Full backup</div>
                                </div>
                            </button>

                            {/* CSV Export */}
                            <button
                                onClick={exportToCSV}
                                className="flex flex-col items-center gap-3 p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all group"
                            >
                                <FileSpreadsheet size={32} className="text-green-600 group-hover:scale-110 transition-transform" />
                                <div className="text-center">
                                    <div className="font-semibold text-gray-800">CSV</div>
                                    <div className="text-xs text-gray-500">Spreadsheet</div>
                                </div>
                            </button>

                            {/* PDF Export */}
                            <button
                                onClick={exportToPDF}
                                className="flex flex-col items-center gap-3 p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                            >
                                <FileText size={32} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                <div className="text-center">
                                    <div className="font-semibold text-gray-800">PDF</div>
                                    <div className="text-xs text-gray-500">Printable</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Import Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Upload size={20} className="text-blue-600" />
                            Import Tasks
                        </h3>

                        {importError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {importError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* JSON Import */}
                            <label className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group">
                                <FileJson size={32} className="text-purple-600 group-hover:scale-110 transition-transform" />
                                <div className="text-center">
                                    <div className="font-semibold text-gray-800">Import JSON</div>
                                    <div className="text-xs text-gray-500">Restore backup</div>
                                </div>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleJSONImport}
                                    className="hidden"
                                    disabled={importing}
                                />
                            </label>

                            {/* CSV Import */}
                            <label className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-green-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group">
                                <FileSpreadsheet size={32} className="text-green-600 group-hover:scale-110 transition-transform" />
                                <div className="text-center">
                                    <div className="font-semibold text-gray-800">Import CSV</div>
                                    <div className="text-xs text-gray-500">From spreadsheet</div>
                                </div>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleCSVImport}
                                    className="hidden"
                                    disabled={importing}
                                />
                            </label>
                        </div>

                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>⚠️ Warning:</strong> Importing will merge with your existing tasks.
                                Tasks with the same ID will be replaced.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
