

/**
 * @description This file defines the useAdminSchemas custom hook that manages admin dashboard state and data fetching.
 * It handles loading schemas, admin status verification, server IP information, and provides centralized state management for the admin interface.
 * The hook includes error handling, caching, and loading states for optimal user experience with MariaDB integration.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hey-boss/users-service/react';
import { adminApi } from '../services/adminApi';

interface ServerInfo {
  serverIP: string;
  databaseConnectionStatus: string;
  databaseHost: string;
  databaseName: string;
}

export const useAdminSchemas = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [schemas, setSchemas] = useState<Record<string, any>>({});
  const [schemaNames, setSchemaNames] = useState<string[]>([]);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [schemasLoading, setSchemasLoading] = useState(false);
  const [serverInfoLoading, setServerInfoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !authLoading;

  // Check admin status
  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Load schemas when admin status is confirmed
  useEffect(() => {
    if (isAdmin) {
      loadSchemas();
      loadServerInfo();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      setError(null);
      const result = await adminApi.getAdminStatus();
      setIsAdmin(result.isAdmin);
    } catch (err) {
      console.error('Admin status check failed:', err);
      setError('Failed to verify admin status');
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadSchemas = async () => {
    try {
      setSchemasLoading(true);
      setError(null);

      // Get schema names
      const names = await adminApi.getSchemas();
      setSchemaNames(names);

      // Load individual schemas
      const schemaPromises = names.map(async (name: string) => {
        try {
          const schema = await adminApi.getSchema(name);
          return { name, schema };
        } catch (err) {
          console.warn(`Failed to load schema for ${name}:`, err);
          return { name, schema: null };
        }
      });

      const schemaResults = await Promise.all(schemaPromises);
      const schemasMap: Record<string, any> = {};
      
      schemaResults.forEach(({ name, schema }) => {
        if (schema) {
          schemasMap[name] = schema;
        }
      });

      setSchemas(schemasMap);
    } catch (err) {
      console.error('Schema loading failed:', err);
      setError('Failed to load database schemas');
    } finally {
      setSchemasLoading(false);
    }
  };

  const loadServerInfo = async () => {
    try {
      setServerInfoLoading(true);
      const info = await adminApi.getServerIP();
      setServerInfo(info);
    } catch (err) {
      console.error('Server info loading failed:', err);
      // Don't set error for server info as it's not critical
    } finally {
      setServerInfoLoading(false);
    }
  };

  const refreshSchemas = useCallback(async () => {
    if (isAdmin) {
      await Promise.all([loadSchemas(), loadServerInfo()]);
    }
  }, [isAdmin]);

  return {
    isAdmin,
    isAuthenticated,
    schemas,
    schemaNames,
    serverInfo,
    loading: loading || authLoading,
    schemasLoading,
    serverInfoLoading,
    error,
    refreshSchemas
  };
};

