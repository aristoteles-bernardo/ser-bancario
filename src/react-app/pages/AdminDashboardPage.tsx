


/**
 * @description This file defines the AdminDashboardPage component that serves as the main admin interface for the Ser Bancário portal.
 * It loads all available schemas, checks admin status, and renders schema-driven tables with full CRUD operations.
 * The component includes proper authentication guards, loading states, and error handling for a complete admin experience.
 */

import React, { useState } from 'react';
import { useAuth } from '@hey-boss/users-service/react';
import { Navigate } from 'react-router-dom';
import { 
  Database, 
  LogOut, 
  Settings, 
  Users, 
  Loader, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { useAdminSchemas } from '../hooks/useAdminSchemas';
import { SchemaTable } from '../components/Admin/SchemaTable';

export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const { 
    isAdmin, 
    isAuthenticated, 
    schemas, 
    schemaNames, 
    serverInfo,
    loading, 
    schemasLoading,
    serverInfoLoading,
    error,
    refreshSchemas 
  } = useAdminSchemas();
  
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Authentication guard
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?returnUrl=/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You are not authorized to access the admin dashboard.
          </p>
          <button
            onClick={() => logout()}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  // Set first available table as default
  if (!selectedTable && schemaNames.length > 0) {
    setSelectedTable(schemaNames[0]);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-black text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-yellow-500">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Ser Bancário</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-800 rounded-md"
            >
              {sidebarCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tables Navigation */}
        <div className="flex-1 py-4">
          {!sidebarCollapsed && (
            <div className="px-4 mb-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Data Tables
              </h2>
            </div>
          )}
          
          {schemasLoading ? (
            <div className="px-4">
              <div className="flex items-center">
                <Loader className="w-4 h-4 animate-spin text-gray-400" />
                {!sidebarCollapsed && <span className="ml-2 text-sm text-gray-400">Loading tables...</span>}
              </div>
            </div>
          ) : schemaNames.length === 0 ? (
            !sidebarCollapsed && (
              <div className="px-4">
                <p className="text-sm text-gray-400">No tables found</p>
              </div>
            )
          ) : (
            <div className="space-y-1">
              {schemaNames.map((tableName) => {
                const schema = schemas[tableName];
                const isSelected = selectedTable === tableName;
                
                return (
                  <button
                    key={tableName}
                    onClick={() => setSelectedTable(tableName)}
                    className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-800 transition-colors ${
                      isSelected ? 'bg-gray-800 border-r-2 border-yellow-500' : ''
                    }`}
                  >
                    <Database className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {schema?.title || tableName}
                        </p>
                        {schema?.description && (
                          <p className="text-xs text-gray-400 truncate">
                            {schema.description}
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Layers className="w-5 h-5 text-gray-400 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedTable && schemas[selectedTable] 
                  ? schemas[selectedTable].title || selectedTable
                  : 'Admin Dashboard'
                }
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Server Info Display */}
              {serverInfo && (
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded border">
                  <span className="font-medium">Server IP:</span> {serverInfo.serverIP}
                  <span className="ml-3 font-medium">Status:</span> 
                  <span className={`ml-1 ${serverInfo.databaseConnectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                    {serverInfo.databaseConnectionStatus}
                  </span>
                </div>
              )}
              <button
                onClick={refreshSchemas}
                disabled={schemasLoading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {schemasLoading ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {/* Content Area */}
        <div className="flex-1 p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Server Information Card */}
          {serverInfo && !selectedTable && (
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Database Connection Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Server IP Address</label>
                  <div className="bg-gray-50 px-3 py-2 rounded border text-gray-900 font-mono">
                    {serverInfo.serverIP}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Database Host</label>
                  <div className="bg-gray-50 px-3 py-2 rounded border text-gray-900 font-mono">
                    {serverInfo.databaseHost}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                  <div className="bg-gray-50 px-3 py-2 rounded border text-gray-900 font-mono">
                    {serverInfo.databaseName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Connection Status</label>
                  <div className={`px-3 py-2 rounded border font-medium ${
                    serverInfo.databaseConnectionStatus === 'Connected' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {serverInfo.databaseConnectionStatus}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>This information is used for database access permissions and firewall configuration.</p>
                <p>Ensure the server IP ({serverInfo.serverIP}) is whitelisted in your MariaDB instance.</p>
              </div>
            </div>
          )}

          {selectedTable && schemas[selectedTable] ? (
            <SchemaTable
              tableName={selectedTable}
              schema={schemas[selectedTable]}
            />
          ) : schemaNames.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No Data Tables Found</h2>
              <p className="text-gray-600 mb-4">
                No database schemas were found. Make sure you have schema files in the `src/shared/schemas/` directory.
              </p>
              <button
                onClick={refreshSchemas}
                disabled={schemasLoading}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {schemasLoading ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                Refresh Tables
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Select a Table</h2>
              <p className="text-gray-600">
                Choose a table from the sidebar to view and manage its data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


