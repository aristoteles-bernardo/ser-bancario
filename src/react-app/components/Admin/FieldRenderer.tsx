

/**
 * @description This file defines the FieldRenderer component that dynamically renders form inputs based on schema field types.
 * It supports all field types including text, number, date-time, rich text with react-quill, file uploads, and toggles.
 * The component ensures proper validation, error handling, and consistent styling across all input types.
 */

import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Upload, X, FileText, Image as ImageIcon, Link, Calendar } from 'lucide-react';
import { uploadFile, uploadMedia } from '../../services/adminApi';

interface FieldRendererProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fieldType = field.type;
  const fieldFormat = field.format;
  const fieldTitle = field.title || field.name || 'Field';
  const isRequired = field.required;
  const isReadOnly = field.readOnly;

  // Handle file upload
  const handleFileUpload = async (file: File, isMedia: boolean = false) => {
    setUploading(true);
    setUploadError('');
    
    try {
      const response = isMedia ? await uploadMedia(file) : await uploadFile(file);
      onChange(response.url);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Render based on field type and format
  const renderField = () => {
    // Read-only fields (like ID, timestamps)
    if (isReadOnly || field.primaryKey) {
      return (
        <input
          type="text"
          value={value || ''}
          readOnly
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
        />
      );
    }

    // Rich text editor
    if (fieldType === 'string' && (field.widget === 'rich_text' || field.format === 'rich_text')) {
      return (
        <div className="border border-gray-300 rounded-md">
          <ReactQuill
            value={value || ''}
            onChange={onChange}
            readOnly={disabled}
            theme="snow"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'blockquote'],
                ['clean']
              ],
            }}
            style={{ minHeight: '120px' }}
          />
        </div>
      );
    }

    // File/Media upload fields
    if (fieldType === 'string' && (
      field.widget === 'file_url' || 
      field.widget === 'media_url' ||
      field.format === 'uri' && (fieldTitle.toLowerCase().includes('image') || fieldTitle.toLowerCase().includes('file'))
    )) {
      const isMediaField = field.widget === 'media_url' || fieldTitle.toLowerCase().includes('image');
      
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? 'Uploading...' : `Upload ${isMediaField ? 'Image' : 'File'}`}
            </button>
            
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                disabled={disabled}
                className="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={isMediaField ? 'image/*,video/*' : '*/*'}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file, isMediaField);
              }
            }}
            className="hidden"
          />
          
          {value && (
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              {isMediaField ? <ImageIcon className="w-4 h-4 text-gray-500" /> : <FileText className="w-4 h-4 text-gray-500" />}
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm truncate flex-1"
              >
                {value}
              </a>
            </div>
          )}
          
          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}
        </div>
      );
    }

    // Date/DateTime fields
    if (fieldType === 'string' && (fieldFormat === 'date-time' || fieldFormat === 'date')) {
      return (
        <div className="relative">
          <input
            type={fieldFormat === 'date' ? 'date' : 'datetime-local'}
            value={value ? (fieldFormat === 'date' ? value.split('T')[0] : value.replace('Z', '').slice(0, 16)) : ''}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue) {
                const formatted = fieldFormat === 'date' 
                  ? `${inputValue}T00:00:00.000Z`
                  : `${inputValue}:00.000Z`;
                onChange(formatted);
              } else {
                onChange('');
              }
            }}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      );
    }

    // Boolean/Checkbox fields
    if (fieldType === 'boolean' || field.widget === 'checkbox') {
      return (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 disabled:opacity-50"
          />
          <span className="text-sm text-gray-700">{fieldTitle}</span>
        </label>
      );
    }

    // Integer fields (stored as INTEGER in D1, but boolean flags use 0/1)
    if (fieldType === 'integer') {
      // Check if it's a boolean flag (title suggests boolean or has limited values)
      const isBooleanFlag = fieldTitle.toLowerCase().includes('active') || 
                           fieldTitle.toLowerCase().includes('enabled') ||
                           fieldTitle.toLowerCase().includes('sent') ||
                           field.enum?.length === 2;
      
      if (isBooleanFlag) {
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value === 1}
              onChange={(e) => onChange(e.target.checked ? 1 : 0)}
              disabled={disabled}
              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">{fieldTitle}</span>
          </label>
        );
      }
      
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      );
    }

    // Number fields
    if (fieldType === 'number') {
      return (
        <input
          type="number"
          step="any"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      );
    }

    // Email fields
    if (fieldType === 'string' && fieldFormat === 'email') {
      return (
        <input
          type="email"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      );
    }

    // URL fields
    if (fieldType === 'string' && (fieldFormat === 'uri' || field.widget === 'web_url')) {
      return (
        <div className="relative">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="https://..."
            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <Link className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      );
    }

    // Textarea for long text
    if (fieldType === 'string' && (field.widget === 'textarea' || (field.maxLength && field.maxLength > 255))) {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
        />
      );
    }

    // Select/Enum fields
    if (field.enum && field.enum.length > 0) {
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select {fieldTitle}</option>
          {field.enum.map((option: any) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    // Default: Text input
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {fieldTitle}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
    </div>
  );
};

