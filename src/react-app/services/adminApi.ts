


/**
 * @description This file defines the admin API service layer that handles all communication with the backend Worker endpoints.
 * It provides functions for authentication, schema discovery, CRUD operations, file uploads, CSV exports, and server information.
 * The service includes proper error handling and type safety for all admin dashboard operations.
 */

// Define types for better type safety
export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface Schema {
  $id: string;
  title: string;
  description: string;
  type: string;
  required: string[];
  properties: {
    [key: string]: {
      type: string;
      title: string;
      description?: string;
      readOnly?: boolean;
      primaryKey?: boolean;
      format?: string;
      widget?: string;
      enum?: string[];
      enumNames?: string[];
      minLength?: number;
      maxLength?: number;
      minimum?: number;
      maximum?: number;
      default?: any;
      unique?: boolean;
      index?: boolean;
    };
  };
}

export interface TableDataResponse {
  data: TableRow[];
  total: number;
  page: number;
  limit: number;
}

// Admin API endpoints
export const adminApi = {
  // Get admin status
  getAdminStatus: async () => {
    const response = await fetch('/api/admin/status');
    if (!response.ok) {
      throw new Error('Failed to check admin status');
    }
    return response.json();
  },

  // Get server IP information
  getServerIP: async () => {
    const response = await fetch('/api/admin/server-ip');
    if (!response.ok) {
      throw new Error('Failed to fetch server IP information');
    }
    return response.json();
  },

  // Schema discovery
  getSchemas: async () => {
    const response = await fetch('/api/admin/schemas');
    if (!response.ok) {
      throw new Error('Failed to fetch schemas');
    }
    return response.json();
  },

  getSchema: async (tableName: string): Promise<Schema> => {
    const response = await fetch(`/api/admin/schemas/${tableName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch schema for ${tableName}`);
    }
    return response.json();
  },

  // Table data operations
  getTableData: async (tableName: string, page = 1, limit = 50, sort?: string): Promise<TableDataResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (sort) {
      params.append('sort', sort);
    }

    const response = await fetch(`/api/tables/${tableName}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${tableName}`);
    }
    return response.json();
  },

  createRecord: async (tableName: string, data: any) => {
    const response = await fetch(`/api/tables/${tableName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.details || result.error || 'Failed to create record');
    }
    return result;
  },

  updateRecord: async (tableName: string, id: string | number, data: any) => {
    const response = await fetch(`/api/tables/${tableName}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.details || result.error || 'Failed to update record');
    }
    return result;
  },

  deleteRecord: async (tableName: string, id: string | number) => {
    const response = await fetch(`/api/tables/${tableName}/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.details || result.error || 'Failed to delete record');
    }
    return result;
  },

  // File upload operations
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/media', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to upload media');
    }
    return response.json();
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to upload file');
    }
    return response.json();
  },

  // Export operations
  exportTableCsv: async (
    tableName: string,
    params: Record<string, any> = {}
  ): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    const endpoint = `/api/tables/${tableName}/export${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Export failed');
    }
    
    return response.blob();
  },
};

// Export individual functions for easier imports
export const getTableRows = adminApi.getTableData;
export const createRow = adminApi.createRecord;
export const updateRow = adminApi.updateRecord;
export const deleteRow = adminApi.deleteRecord;
export const exportTableCsv = adminApi.exportTableCsv;
export const uploadFile = adminApi.uploadFile;
export const uploadMedia = adminApi.uploadMedia;

// Helper function for downloading CSV
export const downloadCsv = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};


