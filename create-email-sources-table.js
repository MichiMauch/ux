// Script to create email sources tracking table in Turso database
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

async function createEmailSourcesTable() {
  try {
    console.log('🚀 Creating email sources tracking table...\n');
    
    // Create email_sources table to track where emails come from
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS email_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        source TEXT NOT NULL, -- 'pagespeed' or 'geo-check'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Created email_sources table');
    
    // Create index for better performance
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_email_sources_analysis_id ON email_sources(analysis_id);
    `);
    console.log('✅ Created index on email_sources.analysis_id');
    
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_email_sources_source ON email_sources(source);
    `);
    console.log('✅ Created index on email_sources.source');
    
    // Verify the table exists
    const tables = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table' AND name = 'email_sources'");
    console.log('\n📋 Email sources table created:', tables.rows.length > 0 ? 'YES' : 'NO');
    
    // Check table structure
    const columns = await tursoClient.execute("PRAGMA table_info(email_sources)");
    console.log('\n📊 email_sources table columns:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    console.log('\n✅ Email sources tracking table setup complete!');
    console.log('\n📝 Usage:');
    console.log('  - PageSpeed emails will be tracked with source="pagespeed"');
    console.log('  - GEO-Check emails will be tracked with source="geo-check"');
    
  } catch (error) {
    console.error('❌ Error creating email sources table:', error);
  } finally {
    tursoClient.close();
  }
}

createEmailSourcesTable();