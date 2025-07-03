// Script to create GEO check tables in Turso database
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

async function createGeoTables() {
  try {
    console.log('🚀 Creating GEO check tables...\n');
    
    // First, add geo_score column to analyses table if it doesn't exist
    try {
      await tursoClient.execute(`
        ALTER TABLE analyses ADD COLUMN geo_score INTEGER DEFAULT 0;
      `);
      console.log('✅ Added geo_score column to analyses table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('ℹ️  geo_score column already exists in analyses table');
      } else {
        throw error;
      }
    }
    
    // Create geo_factors table
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS geo_factors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        result INTEGER NOT NULL,  -- 0 for false, 1 for true
        weight REAL NOT NULL,
        comment TEXT NOT NULL,
        details TEXT,  -- JSON string for additional details
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Created geo_factors table');
    
    // Create index for better performance
    await tursoClient.execute(`
      CREATE INDEX IF NOT EXISTS idx_geo_factors_analysis_id ON geo_factors(analysis_id);
    `);
    console.log('✅ Created index on geo_factors.analysis_id');
    
    // Verify the tables exist
    const tables = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('geo_factors')");
    console.log('\n📋 GEO tables created:', tables.rows.map(row => row.name));
    
    // Check analyses table structure
    const analysesColumns = await tursoClient.execute("PRAGMA table_info(analyses)");
    const hasGeoScore = analysesColumns.rows.some(col => col.name === 'geo_score');
    console.log('📊 analyses table has geo_score column:', hasGeoScore);
    
    // Check geo_factors table structure
    const geoFactorsColumns = await tursoClient.execute("PRAGMA table_info(geo_factors)");
    console.log('\n📊 geo_factors table columns:');
    geoFactorsColumns.rows.forEach(col => {
      console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    console.log('\n✅ GEO check database setup complete!');
    
  } catch (error) {
    console.error('❌ Error creating GEO tables:', error);
  } finally {
    tursoClient.close();
  }
}

createGeoTables();