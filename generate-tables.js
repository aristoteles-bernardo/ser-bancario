// JSON Schema to SQL Table Generator (ES Module)
// Place this file in your project root and run: node generate-tables.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map JSON schema types to SQL types
function jsonTypeToSql(property, propertyName) {
  const type = property.type;
  const format = property.format;
  
  if (format === 'date-time' || format === 'date') {
    return 'TIMESTAMP';
  }
  
  if (type === 'string') {
    if (property.maxLength) {
      return `VARCHAR(${property.maxLength})`;
    }
    return 'TEXT';
  }
  
  if (type === 'integer') {
    return 'INTEGER';
  }
  
  if (type === 'number') {
    return 'DECIMAL';
  }
  
  if (type === 'boolean') {
    return 'BOOLEAN';
  }
  
  if (type === 'array') {
    return 'JSONB'; // Use JSONB for arrays in PostgreSQL
  }
  
  if (type === 'object') {
    return 'JSONB'; // Use JSONB for objects in PostgreSQL
  }
  
  return 'TEXT'; // Default fallback
}

// Generate CREATE TABLE statement from JSON schema
function generateCreateTable(schema, tableName) {
  const properties = schema.properties || {};
  const required = schema.required || [];
  
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
  
  const columns = [];
  
  // Add id as primary key if it exists
  if (properties.id) {
    columns.push('  id SERIAL PRIMARY KEY');
  }
  
  // Process each property
  for (const [propName, propSchema] of Object.entries(properties)) {
    if (propName === 'id') continue; // Already handled
    
    const sqlType = jsonTypeToSql(propSchema, propName);
    const isRequired = required.includes(propName);
    const notNull = isRequired ? ' NOT NULL' : '';
    const defaultValue = propSchema.default !== undefined ? ` DEFAULT '${propSchema.default}'` : '';
    
    columns.push(`  ${propName} ${sqlType}${notNull}${defaultValue}`);
  }
  
  // Add timestamps if they don't exist
  if (!properties.created_at) {
    columns.push('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
  }
  if (!properties.updated_at) {
    columns.push('  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
  }
  
  sql += columns.join(',\n');
  sql += '\n);\n\n';
  
  // Add index on created_at for better query performance
  sql += `CREATE INDEX IF NOT EXISTS idx_${tableName}_created_at ON ${tableName}(created_at);\n\n`;
  
  return sql;
}

// Main function to process all schema files
function generateAllTables() {
  const schemaDir = path.join(__dirname, 'src', 'shared', 'schemas');
  const outputFile = path.join(__dirname, 'create-tables.sql');
  
  let allSql = `-- Generated SQL Tables from JSON Schemas
-- Generated on: ${new Date().toISOString()}
-- Database: PostgreSQL

`;
  
  try {
    const files = fs.readdirSync(schemaDir);
    
    for (const file of files) {
      if (file.endsWith('-schema.json')) {
        const filePath = path.join(schemaDir, file);
        const schemaContent = fs.readFileSync(filePath, 'utf8');
        const schema = JSON.parse(schemaContent);
        
        // Extract table name from filename (e.g., 'users-schema.json' -> 'users')
        const tableName = file.replace('-schema.json', '');
        
        console.log(`Processing: ${file} -> ${tableName}`);
        
        allSql += `-- Table: ${tableName}\n`;
        allSql += `-- Source: ${file}\n`;
        allSql += generateCreateTable(schema, tableName);
        allSql += '\n';
      }
    }
    
    // Write to output file
    fs.writeFileSync(outputFile, allSql);
    console.log(`\n✅ SQL file generated successfully: ${outputFile}`);
    console.log(`\nTo create the tables, run:`);
    console.log(`psql -U your_username -d your_database -f create-tables.sql`);
    
  } catch (error) {
    console.error('Error generating SQL:', error.message);
    console.error('Make sure the path exists: src/shared/schemas/');
  }
}

// Run the generator
generateAllTables();