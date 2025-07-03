// Script to create the report_downloads table
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

async function createTable() {
  try {
    console.log('🔄 Creating report_downloads table...');
    
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS report_downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        report_type TEXT NOT NULL DEFAULT 'pdf',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (analysis_id) REFERENCES analyses(id)
      )
    `);

    console.log('✅ Table report_downloads created successfully!');
    
    // Check if table was created
    const tables = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='report_downloads'");
    if (tables.rows.length > 0) {
      console.log('✅ Verified: Table exists in database');
      
      // Show table structure
      const columns = await tursoClient.execute(`PRAGMA table_info(report_downloads)`);
      console.log('\n📋 Table structure:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
}

createTable();