// Script to check the current database schema
const { createClient } = require('@libsql/client');
const fs = require('fs');

// Read .env.local file manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

const tursoClient = createClient({
  url: envVars.TURSO_DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...\n');
    
    // Get all tables
    const tables = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Tables found:', tables.rows.map(row => row.name));
    
    // Check each table's columns
    for (const table of tables.rows) {
      const tableName = table.name;
      console.log(`\n📊 Table: ${tableName}`);
      
      const columns = await tursoClient.execute(`PRAGMA table_info(${tableName})`);
      console.log('Columns:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkSchema();