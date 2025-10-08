

/**
 * @description This file defines the SchemaTable component that renders a data table for any schema with full CRUD operations.
 * It supports pagination, sorting, filtering, add/edit/delete modals, and CSV export functionality.
 * The component dynamically adapts to any schema structure and provides a consistent admin interface for all data types.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Download, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Save,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { 
  getTableRows, 
  createRow, 
  updateRow, 
  deleteRow, 
  exportTableCsv, 
  downloadCsv,
  TableRow,
  Schema 
} from '../../services/adminApi';
import { CustomForm } from '../CustomForm';
import { formTheme } from '../CustomForm/formThemes';
import allConfigs from '../../shared/form-configs.json';

interface SchemaTableProps {
  tableName: string;
  schema: Schema;
}

interface FormData {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

export const SchemaTable: React.FC<SchemaTableProps> = ({ tableName, schema }) => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const limit = 50;
  
  // Filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({});
  const [submitting, setSubmitting] = useState(false);
  
  // Export state
  const [exporting, setExporting] = useState(false);

  // Get filterable fields (non-system fields that can be searched)
  const filterableFields = useMemo(() => {
    return Object.entries(schema.properties || {})
      .filter(([key, field]: [string, any]) => 
        !field.readOnly && 
        !field.primaryKey &&
        key !== 'created_at' &&
        key !== 'updated_at' &&
        (field.type === 'string' || field.type === 'integer')
      )
      .map(([key]) => key);
  }, [schema]);

  // Get sortable fields
  const sortableFields = useMemo(() => {
    return Object.entries(schema.properties || {})
      .filter(([key, field]: [string, any]) => 
        field.type === 'string' || 
        field.type === 'integer' || 
        field.type === 'number' ||
        field.format === 'date-time'
      )
      .map(([key]) => key);
  }, [schema]);

  // Generate dynamic schema for CustomForm
  const dynamicFormSchema = useMemo(() => {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    Object.entries(schema.properties || {}).forEach(([key, field]: [string, any]) => {
      if (!field.readOnly && !field.primaryKey) {
        properties[key] = {
          type: field.type,
          title: field.title || key,
          description: field.description,
          format: field.format,
          enum: field.enum,
          enumNames: field.enumNames,
          minLength: field.minLength,
          maxLength: field.maxLength,
          minimum: field.minimum,
          maximum: field.maximum,
          default: field.default,
          multiline: field.widget === 'textarea' || field.widget === 'rich_text',
        };

        if (schema.required?.includes(key)) {
          required.push(key);
        }
      }
    });

    return {
      $schema: "https://json-schema.org/draft-07/schema#",
      $id: `${tableName}_form_schema`,
      type: "object",
      title: `${schema.title || tableName} Form`,
      description: `Form for managing ${schema.title || tableName}`,
      required,
      properties
    };
  }, [schema, tableName]);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit,
      };
      
      if (sortField) {
        params.sort = `${sortField}:${sortDirection}`;
      }
      
      // Add search filter
      if (searchTerm) {
        filterableFields.forEach(field => {
          params[`${field}_like`] = searchTerm;
        });
      }
      
      const result = await getTableRows(tableName, params);
      setData(result.data);
      setTotalRows(result.total);
      setTotalPages(Math.ceil(result.total / limit));
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, sortField, sortDirection, searchTerm]);

  // Initialize form with default values
  const initializeForm = (row?: TableRow) => {
    const initialData: FormData = {};
    
    Object.entries(schema.properties || {}).forEach(([key, field]: [string, any]) => {
      if (row) {
        initialData[key] = row[key];
      } else if (!field.readOnly && !field.primaryKey) {
        initialData[key] = field.default || null;
      }
    });
    
    setFormData(initialData);
  };

  // Handle form data changes
  const handleFormChange = (data: FormData, errors: FormErrors) => {
    setFormData(data);
  };

  // Handle form submission
  const handleFormSubmit = async (submitData: FormData) => {
    setSubmitting(true);
    try {
      // Remove read-only fields from submission
      const cleanData = { ...submitData };
      Object.entries(schema.properties || {}).forEach(([key, field]: [string, any]) => {
        if (field.readOnly || field.primaryKey) {
          delete cleanData[key];
        }
      });
      
      if (selectedRow) {
        await updateRow(tableName, selectedRow.id, cleanData);
      } else {
        await createRow(tableName, cleanData);
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedRow(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save data');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedRow) return;
    
    setSubmitting(true);
    try {
      await deleteRow(tableName, selectedRow.id);
      setShowDeleteModal(false);
      setSelectedRow(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete data');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    setExporting(true);
    try {
      const params: any = {};
      
      if (sortField) {
        params.sort = `${sortField}:${sortDirection}`;
      }
      
      if (searchTerm) {
        filterableFields.forEach(field => {
          params[`${field}_like`] = searchTerm;
        });
      }
      
      const blob = await exportTableCsv(tableName, params);
      const filename = `${schema.title || tableName}.csv`;
      downloadCsv(blob, filename);
    } catch (err: any) {
      setError(err.message || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  // Get display value for a field
  const getDisplayValue = (row: TableRow, fieldName: string) => {
    const value = row[fieldName];
    const field = schema.properties?.[fieldName];
    
    if (value === null || value === undefined) return '-';
    
    // Handle boolean flags (0/1 integers)
    if (field?.type === 'integer' && (value === 0 || value === 1)) {
      const isBooleanFlag = field.title?.toLowerCase().includes('active') || 
                           field.title?.toLowerCase().includes('enabled') ||
                           field.title?.toLowerCase().includes('sent');
      if (isBooleanFlag) {
        return value === 1 ? 'Yes' : 'No';
      }
    }
    
    // Handle rich text (strip HTML for display)
    if (field?.widget === 'rich_text' && typeof value === 'string') {
      const stripped = value.replace(/<[^>]*>/g, '');
      return stripped.length > 100 ? `${stripped.substring(0, 100)}...` : stripped;
    }
    
    // Handle URLs
    if (field?.format === 'uri' || field?.widget === 'web_url') {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value.length > 30 ? `${value.substring(0, 30)}...` : value}
        </a>
      );
    }
    
    // Handle file/media URLs
    if (field?.widget === 'file_url' || field?.widget === 'media_url') {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View File
        </a>
      );
    }
    
    // Handle dates
    if (field?.format === 'date-time' && typeof value === 'string') {
      return new Date(value).toLocaleDateString();
    }
    
    // Truncate long strings
    if (typeof value === 'string' && value.length > 50) {
      return `${value.substring(0, 50)}...`;
    }
    
    return String(value);
  };

  // Handle sort
  const handleSort = (fieldName: string) => {
    if (sortField === fieldName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(fieldName);
      setSortDirection('asc');
    }
  };

  const visibleFields = Object.entries(schema.properties || {})
    .filter(([key, field]: [string, any]) => 
      key !== 'id' || !field.primaryKey // Hide primary key ID from table
    );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {schema.title || tableName}
            </h2>
            {schema.description && (
              <p className="text-sm text-gray-600 mt-1">{schema.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              disabled={exporting || data.length === 0}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export CSV
            </button>
            <button
              onClick={() => {
                initializeForm();
                setShowAddModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </button>
          </div>
        </div>
        
        {/* Search */}
        {filterableFields.length > 0 && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operations
              </th>
              {visibleFields.map(([fieldName, field]: [string, any]) => (
                <th
                  key={fieldName}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    sortableFields.includes(fieldName) ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => sortableFields.includes(fieldName) && handleSort(fieldName)}
                >
                  <div className="flex items-center">
                    {field.title || fieldName}
                    {sortField === fieldName && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={visibleFields.length + 1} className="px-6 py-12 text-center">
                  <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Loading...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={visibleFields.length + 1} className="px-6 py-12 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRow(row);
                          initializeForm(row);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRow(row);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  {visibleFields.map(([fieldName]) => (
                    <td key={fieldName} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getDisplayValue(row, fieldName)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRows)} of {totalRows} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {showAddModal ? 'Add New' : 'Edit'} {schema.title || tableName}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedRow(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <CustomForm
                id="admin_form"
                schema={dynamicFormSchema}
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                theme={{
                  ...formTheme,
                  form: {
                    container: "space-y-6",
                    title: "text-xl font-bold text-gray-900 mb-4",
                    description: "text-gray-600 mb-6"
                  },
                  button: {
                    primary: submitting 
                      ? "w-full px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                      : "w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-300",
                    secondary: "w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all duration-300"
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600">
                Are you sure you want to delete this {schema.title?.toLowerCase() || 'item'}? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRow(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

