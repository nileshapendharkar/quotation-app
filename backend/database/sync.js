const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { MongoClient } = require('mongodb');
const { readData, writeData } = require('./store');

async function runSync() {
  try {
    console.log('🔄 Starting MongoDB Database Synchronization...');
    const localDbPath = path.join(__dirname, 'db_data.json');
    if (!fs.existsSync(localDbPath)) {
      throw new Error(`Database file not found at ${localDbPath}`);
    }

    const localDbRaw = fs.readFileSync(localDbPath, 'utf8');
    const localDb = JSON.parse(localDbRaw);

    console.log(`📦 Local dataset loaded:`);
    console.log(`   - Users: ${localDb.users ? localDb.users.length : 0}`);
    console.log(`   - Categories: ${localDb.categories ? localDb.categories.length : 0}`);
    console.log(`   - Products: ${localDb.products ? localDb.products.length : 0}`);
    console.log(`   - Orders: ${localDb.orders ? localDb.orders.length : 0}`);

    // Sync atomic application state via store
    console.log('💾 Syncing atomic application state to MongoDB...');
    await writeData(localDb);

    // Also populate individual MongoDB collections for direct querying/Compass inspection if URI configured
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (uri) {
      console.log('📑 Synchronizing individual MongoDB collections for direct query access...');
      const dbName = process.env.MONGODB_DB_NAME || 'quotation_app';
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const db = client.db(dbName);

      const collectionsToSync = ['users', 'categories', 'products', 'subCategories', 'orders', 'notifications', 'drafts'];
      for (const colName of collectionsToSync) {
        const items = localDb[colName];
        if (Array.isArray(items) && items.length > 0) {
          const col = db.collection(colName);
          // Upsert each item by its 'id'
          const operations = items.map(item => ({
            updateOne: {
              filter: { _id: item.id || item.code || String(item) },
              update: { $set: item },
              upsert: true
            }
          }));
          await col.bulkWrite(operations);
          console.log(`   ✅ Collection '${colName}' synced (${items.length} records).`);
        }
      }

      await client.close();
    }

    console.log('🎉 MongoDB synchronization completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB synchronization failed:', err.message || err);
    process.exit(1);
  }
}

runSync();

