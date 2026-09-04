const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'eagle_revolution';

async function verify() {
  console.log('--- VERIFYING NEW DATABASE FROM .env.local ---');
  console.log('URI:', uri.replace(/:([^@]+)@/, ':****@'));
  console.log('Database name:', dbName);

  await mongoose.connect(uri, { dbName });
  console.log('Mongoose connected successfully!');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log(`Found ${collections.length} collections:`);

  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(` - ${col.name}: ${count} docs`);
  }

  // Check sample documents
  const samplePost = await db.collection('posts').findOne({}, { projection: { title: 1, slug: 1 } });
  console.log('\nSample Post:', samplePost);

  const samplePage = await db.collection('pages').findOne({}, { projection: { title: 1, slug: 1 } });
  console.log('Sample Page:', samplePage);

  const sampleUser = await db.collection('users').findOne({}, { projection: { username: 1, email: 1, role: 1 } });
  console.log('Sample User:', sampleUser);

  await mongoose.disconnect();
  console.log('\nVerification complete: all checks passed successfully!');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
