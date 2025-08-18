import React, { useState, useRef } from 'react';
import { Customer } from '../App';
import { Upload, FileText, Database, Code, CheckCircle, AlertCircle, Download, Eye } from 'lucide-react';

interface DataImportProps {
  onSelectCustomer: (customer: Customer) => void;
}

interface ImportedCustomer extends Customer {
  isValid: boolean;
  errors: string[];
}

export function DataImport({ onSelectCustomer }: DataImportProps) {
  const [importedData, setImportedData] = useState<ImportedCustomer[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'xml'>('csv');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      let parsedData: any[] = [];
      
      if (fileExtension === 'csv' || selectedFormat === 'csv') {
        parsedData = parseCSV(text);
      } else if (fileExtension === 'json' || selectedFormat === 'json') {
        parsedData = JSON.parse(text);
      } else if (fileExtension === 'xml' || selectedFormat === 'xml') {
        parsedData = parseXML(text);
      }
      
      const validatedData = validateAndTransformData(parsedData);
      setImportedData(validatedData);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  };

  const parseXML = (text: string): any[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const customers = xmlDoc.getElementsByTagName('customer');
    
    const result: any[] = [];
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const obj: any = {};
      
      for (let j = 0; j < customer.children.length; j++) {
        const child = customer.children[j];
        obj[child.tagName] = child.textContent || '';
      }
      result.push(obj);
    }
    return result;
  };

  const validateAndTransformData = (data: any[]): ImportedCustomer[] => {
    return data.map((item, index) => {
      const errors: string[] = [];
      
      // Transform and validate each field
      const customer: Customer = {
        customer_id: item.customer_id || item.id || `IMPORTED_${index + 1}`,
        tenure_months: parseFloat(item.tenure_months || item.tenure || '0') || 0,
        monthly_charges: parseFloat(item.monthly_charges || item.monthly_charge || '0') || 0,
        total_charges: parseFloat(item.total_charges || item.total_charge || '0') || 0,
        contract_type: item.contract_type || item.contract || 'monthly',
        support_tickets: parseInt(item.support_tickets || item.tickets || '0') || 0,
        payment_method: item.payment_method || item.payment || 'credit_card',
        service_usage: parseFloat(item.service_usage || item.usage || '0') || 0,
        satisfaction_score: parseFloat(item.satisfaction_score || item.satisfaction || '0') || 0
      };

      // Validation
      if (customer.tenure_months < 0) errors.push('Invalid tenure months');
      if (customer.monthly_charges < 0) errors.push('Invalid monthly charges');
      if (customer.total_charges < 0) errors.push('Invalid total charges');
      if (!['monthly', 'yearly', 'two_year'].includes(customer.contract_type)) {
        customer.contract_type = 'monthly';
        errors.push('Invalid contract type, defaulted to monthly');
      }
      if (customer.support_tickets < 0) errors.push('Invalid support tickets');
      if (!['credit_card', 'debit_card', 'bank_transfer', 'cash'].includes(customer.payment_method)) {
        customer.payment_method = 'credit_card';
        errors.push('Invalid payment method, defaulted to credit card');
      }
      if (customer.service_usage < 0 || customer.service_usage > 100) {
        customer.service_usage = Math.max(0, Math.min(100, customer.service_usage));
        errors.push('Service usage adjusted to valid range (0-100)');
      }
      if (customer.satisfaction_score < 1 || customer.satisfaction_score > 10) {
        customer.satisfaction_score = Math.max(1, Math.min(10, customer.satisfaction_score));
        errors.push('Satisfaction score adjusted to valid range (1-10)');
      }

      return {
        ...customer,
        isValid: errors.length === 0,
        errors
      };
    });
  };

  const downloadSampleFile = (format: 'csv' | 'json' | 'xml') => {
    const sampleData = [
      {
        customer_id: 'SAMPLE_001',
        tenure_months: 12,
        monthly_charges: 65.50,
        total_charges: 786.00,
        contract_type: 'yearly',
        support_tickets: 2,
        payment_method: 'credit_card',
        service_usage: 75.5,
        satisfaction_score: 8.2
      },
      {
        customer_id: 'SAMPLE_002',
        tenure_months: 3,
        monthly_charges: 89.90,
        total_charges: 269.70,
        contract_type: 'monthly',
        support_tickets: 5,
        payment_method: 'debit_card',
        service_usage: 25.3,
        satisfaction_score: 4.1
      }
    ];

    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'csv') {
      const headers = Object.keys(sampleData[0]).join(',');
      const rows = sampleData.map(item => Object.values(item).join(',')).join('\n');
      content = `${headers}\n${rows}`;
      filename = 'sample_customers.csv';
      mimeType = 'text/csv';
    } else if (format === 'json') {
      content = JSON.stringify(sampleData, null, 2);
      filename = 'sample_customers.json';
      mimeType = 'application/json';
    } else if (format === 'xml') {
      content = `<?xml version="1.0" encoding="UTF-8"?>\n<customers>\n`;
      sampleData.forEach(customer => {
        content += '  <customer>\n';
        Object.entries(customer).forEach(([key, value]) => {
          content += `    <${key}>${value}</${key}>\n`;
        });
        content += '  </customer>\n';
      });
      content += '</customers>';
      filename = 'sample_customers.xml';
      mimeType = 'application/xml';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">Import Customer Data</h2>
              <p className="text-slate-600">Upload CSV, JSON, or XML files with customer information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Format Selection */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Select File Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { format: 'csv' as const, icon: FileText, title: 'CSV Format', desc: 'Comma-separated values' },
            { format: 'json' as const, icon: Database, title: 'JSON Format', desc: 'JavaScript Object Notation' },
            { format: 'xml' as const, icon: Code, title: 'XML Format', desc: 'Extensible Markup Language' }
          ].map(({ format, icon: Icon, title, desc }) => (
            <div
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedFormat === format
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={`w-5 h-5 ${selectedFormat === format ? 'text-blue-600' : 'text-slate-600'}`} />
                <span className={`font-medium ${selectedFormat === format ? 'text-blue-800' : 'text-slate-800'}`}>
                  {title}
                </span>
              </div>
              <p className={`text-sm ${selectedFormat === format ? 'text-blue-600' : 'text-slate-500'}`}>
                {desc}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadSampleFile(format);
                }}
                className="mt-3 flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Download className="w-3 h-3" />
                <span>Download Sample</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload Area */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,.xml"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Upload className="w-10 h-10 text-slate-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Drop your {selectedFormat.toUpperCase()} file here
              </h3>
              <p className="text-slate-600 mb-4">
                or click to browse and select a file from your computer
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isProcessing ? 'Processing...' : 'Choose File'}
            </button>
          </div>
        </div>
      </div>

      {/* Imported Data Preview */}
      {importedData.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Imported Data Preview</h3>
                <p className="text-slate-600">
                  {importedData.filter(c => c.isValid).length} valid, {importedData.filter(c => !c.isValid).length} with issues
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {importedData.map((customer, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  customer.isValid
                    ? 'border-green-200 bg-green-50'
                    : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      customer.isValid ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {customer.isValid ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-slate-800">{customer.customer_id}</span>
                  </div>
                  <button
                    onClick={() => onSelectCustomer(customer)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors"
                  >
                    Analyze
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-2">
                  <div><span className="text-slate-500">Tenure:</span> {customer.tenure_months}m</div>
                  <div><span className="text-slate-500">Monthly:</span> ${customer.monthly_charges}</div>
                  <div><span className="text-slate-500">Satisfaction:</span> {customer.satisfaction_score}/10</div>
                  <div><span className="text-slate-500">Usage:</span> {customer.service_usage}%</div>
                </div>
                
                {customer.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-yellow-700 mb-1">Issues found:</p>
                    <ul className="text-xs text-yellow-600 space-y-1">
                      {customer.errors.map((error, errorIndex) => (
                        <li key={errorIndex}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}