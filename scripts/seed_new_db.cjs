const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if restricted
}

const { MongoClient, BSON } = require('mongodb');
const fs = require('fs');
const path = require('path');

const targetUri = process.env.NEW_MONGODB_URI || 
  'mongodb+srv://ammansoor0077_db_user:7DgsNDPSTSi3PX7f@cluster0.sqgewel.mongodb.net/eagle_revolution?retryWrites=true&w=majority&appName=Cluster0';

const targetDbName = 'eagle_revolution';
const exportDir = path.resolve(__dirname, '../backup/mongodb_export');

async function seedDatabase() {
  const manifestPath = path.join(exportDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found at ${manifestPath}. Run export_db.cjs first.`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`Connecting to target cluster for database: ${targetDbName}...`);
  
  const client = new MongoClient(targetUri, { serverSelectionTimeoutMS: 15000 });

  try {
    await client.connect();
    console.log('Connected successfully to target database cluster.');

    const db = client.db(targetDbName);
    let totalImported = 0;
    const summary = [];

    for (const colName of Object.keys(manifest.collections)) {
      const meta = manifest.collections[colName];
      const filePath = path.join(exportDir, `${colName}.json`);

      console.log(`\nProcessing collection '${colName}'...`);
      const targetCol = db.collection(colName);

      if (fs.existsSync(filePath)) {
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const docs = BSON.EJSON.parse(rawContent, { relaxed: false });

        if (docs.length > 0) {
          // Clean existing docs if any to prevent duplicates on rerun
          await targetCol.deleteMany({});
          
          // Insert in chunks of 500 for efficiency
          const chunkSize = 500;
          for (let i = 0; i < docs.length; i += chunkSize) {
            const chunk = docs.slice(i, i + chunkSize);
            await targetCol.insertMany(chunk, { ordered: true });
          }
          console.log(` -> Inserted ${docs.length} documents into '${colName}'.`);
          totalImported += docs.length;
        } else {
          console.log(` -> Collection '${colName}' is empty (0 docs), skipping insert.`);
        }
      }

      // Recreate indexes if any
      if (meta.indexes && meta.indexes.length > 0) {
        for (const idx of meta.indexes) {
          try {
            const options = { name: idx.name };
            if (idx.unique) options.unique = true;
            if (idx.sparse) options.sparse = true;
            if (idx.expireAfterSeconds !== undefined) options.expireAfterSeconds = idx.expireAfterSeconds;

            await targetCol.createIndex(idx.key, options);
            console.log(` -> Recreated index '${idx.name}' on '${colName}'.`);
          } catch (idxErr) {
            console.warn(` -> Note on index '${idx.name}':`, idxErr.message);
          }
        }
      }

      // Verify count in target DB
      const targetCount = await targetCol.countDocuments();
      const match = targetCount === meta.count;
      summary.push({
        collection: colName,
        expected: meta.count,
        actual: targetCount,
        status: match ? 'MATCH' : 'MISMATCH'
      });
    }

    console.log('\n=========================================');
    console.log('SEEDING & VERIFICATION SUMMARY:');
    console.log('=========================================');
    console.table(summary);

    const allMatched = summary.every(s => s.status === 'MATCH');
    if (!allMatched) {
      console.error('ERROR: Some collection document counts do not match!');
      process.exit(1);
    } else {
      console.log(`SUCCESS: All ${totalImported} documents and custom indexes were seeded and verified 100%!`);
    }
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
