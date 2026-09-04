const { MongoClient, BSON } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const sourceUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'eagle_revolution';
const exportDir = path.resolve(__dirname, '../backup/mongodb_export');

async function exportDatabase() {
  if (!sourceUri) {
    throw new Error('MONGODB_URI is not set in .env.local');
  }

  console.log(`Connecting to source database: ${dbName}...`);
  const client = new MongoClient(sourceUri);

  try {
    await client.connect();
    console.log('Connected successfully to source database.');

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const manifest = {
      timestamp: new Date().toISOString(),
      sourceDb: dbName,
      collections: {}
    };

    let totalDocs = 0;

    for (const colInfo of collections) {
      const colName = colInfo.name;
      console.log(`Exporting collection '${colName}'...`);

      const collection = db.collection(colName);
      const docs = await collection.find({}).toArray();
      const indexes = await collection.indexes();

      const filePath = path.join(exportDir, `${colName}.json`);
      const meta = {
        name: colName,
        count: docs.length,
        indexes: indexes.filter(idx => idx.name !== '_id_')
      };

      // Export documents in EJSON format to preserve ObjectIds, Dates, etc.
      const serializedData = BSON.EJSON.stringify(docs, { relaxed: false }, 2);
      fs.writeFileSync(filePath, serializedData, 'utf8');

      manifest.collections[colName] = meta;
      totalDocs += docs.length;

      console.log(` -> Exported ${docs.length} documents and ${indexes.length} indexes to ${colName}.json`);
    }

    fs.writeFileSync(
      path.join(exportDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf8'
    );

    console.log('\n=========================================');
    console.log(`EXPORT COMPLETE: ${totalDocs} total documents exported across ${collections.length} collections.`);
    console.log(`Export files saved to: ${exportDir}`);
    console.log('=========================================\n');
  } catch (err) {
    console.error('Export failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

exportDatabase();
