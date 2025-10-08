


/**
 * @description This file establishes a secure MariaDB connection pool using the provided credentials and exports query helper functions.
 * It handles connection management, query execution, and proper error handling for all database operations.
 * The connection pool ensures optimal performance and resource management for concurrent database requests.
 */

import * as mariadb from 'mariadb';

// MariaDB connection configuration
const DB_CONFIG = {
  host: '217.77.6.254',
  user: 'serbanca_sa',
  password: 'S6rB@ncar!02025',
  database: 'serbanca_production',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  charset: 'utf8mb4',
  timezone: 'UTC'
};

// Create connection pool
let pool: mariadb.Pool | null = null;

const getPool = (): mariadb.Pool => {
  if (!pool) {
    pool = mariadb.createPool(DB_CONFIG);
  }
  return pool;
};

// Generic query function
export const query = async (sql: string, params: any[] = []): Promise<any[]> => {
  const conn = await getPool().getConnection();
  try {
    const result = await conn.query(sql, params);
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error('MariaDB Query Error:', error);
    throw error;
  } finally {
    conn.release();
  }
};

// Helper function for single row queries
export const queryOne = async (sql: string, params: any[] = []): Promise<any | null> => {
  const results = await query(sql, params);
  return results.length > 0 ? results[0] : null;
};

// Helper function for INSERT operations
export const insert = async (sql: string, params: any[] = []): Promise<{ insertId: number; affectedRows: number }> => {
  const conn = await getPool().getConnection();
  try {
    const result = await conn.query(sql, params);
    return {
      insertId: result.insertId || 0,
      affectedRows: result.affectedRows || 0
    };
  } catch (error) {
    console.error('MariaDB Insert Error:', error);
    throw error;
  } finally {
    conn.release();
  }
};

// Helper function for UPDATE operations
export const update = async (sql: string, params: any[] = []): Promise<{ affectedRows: number }> => {
  const conn = await getPool().getConnection();
  try {
    const result = await conn.query(sql, params);
    return {
      affectedRows: result.affectedRows || 0
    };
  } catch (error) {
    console.error('MariaDB Update Error:', error);
    throw error;
  } finally {
    conn.release();
  }
};

// Helper function for DELETE operations
export const deleteRecord = async (sql: string, params: any[] = []): Promise<{ affectedRows: number }> => {
  const conn = await getPool().getConnection();
  try {
    const result = await conn.query(sql, params);
    return {
      affectedRows: result.affectedRows || 0
    };
  } catch (error) {
    console.error('MariaDB Delete Error:', error);
    throw error;
  } finally {
    conn.release();
  }
};

// Function to get server IP address
export const getServerIP = async (): Promise<string> => {
  try {
    // Try multiple IP lookup services for reliability
    const services = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://httpbin.org/ip'
    ];
    
    for (const service of services) {
      try {
        const response = await fetch(service);
        if (response.ok) {
          const data = await response.json();
          return data.ip || data.origin || 'Unknown';
        }
      } catch (err) {
        console.warn(`Failed to get IP from ${service}:`, err);
        continue;
      }
    }
    
    return 'Unable to determine IP';
  } catch (error) {
    console.error('Error getting server IP:', error);
    return 'Error retrieving IP';
  }
};

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    const conn = await getPool().getConnection();
    await conn.query('SELECT 1');
    conn.release();
    return true;
  } catch (error) {
    console.error('MariaDB Connection Test Failed:', error);
    return false;
  }
};


