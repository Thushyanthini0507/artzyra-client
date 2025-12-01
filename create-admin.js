const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = "mongodb://localhost:27017/artzyra";

async function createAdmin() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
    
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const adminData = {
      name: "Test Admin",
      email: "testadmin@artzyra.com",
      password: hashedPassword,
      role: "admin",
      status: "approved",
      phone: "+1234567890",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if exists
    const existing = await mongoose.connection.db.collection('users').findOne({ email: adminData.email });
    if (existing) {
      console.log("⚠️ Admin already exists, updating password...");
      await mongoose.connection.db.collection('users').updateOne(
        { email: adminData.email },
        { $set: { password: hashedPassword } }
      );
    } else {
      console.log("Creating new admin...");
      await mongoose.connection.db.collection('users').insertOne(adminData);
    }
    
    console.log("✅ Admin user ready: testadmin@artzyra.com / password123");
    
  } catch (err) {
    console.error("❌ Failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
