const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/artzyra";

async function check() {
  try {
    await mongoose.connect(uri);
    
    const admin = await mongoose.connection.db.collection('users').findOne({ role: 'admin' });
    
    if (admin) {
      console.log("✅ Admin found:");
      console.log("Email:", admin.email);
      console.log("Name:", admin.name);
      // We can't see the password, but we assume it's SecurePass123! based on docs
    } else {
      console.log("❌ No admin user found!");
    }
    
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

check();
