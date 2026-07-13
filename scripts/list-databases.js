const mongoose = require('mongoose');
async function listDatabases() {
  try {
    const MONGODB_URI = "mongodb://localhost:27017";
    await mongoose.connect(MONGODB_URI);
    const adminDb = mongoose.connection.client.db().admin();
    const dbsList = await adminDb.listDatabases();
    console.log("Databases on local MongoDB server:");
    dbsList.databases.forEach(db => {
      console.log(`- ${db.name} (Size on disk: ${db.sizeOnDisk} bytes)`);
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
listDatabases();
