const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Read .env.local file
let MONGODB_URI =
  "mongodb+srv://thushyanthini0507_db_user:thusi0507@artzyra.zd9ep8g.mongodb.net/artzyra_db?retryWrites=true&w=majority";
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) {
      MONGODB_URI = match[1].trim();
    }
  }
} catch (error) {
  console.log('Using default MongoDB URI');
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'artist', 'admin'], default: 'customer' },
  phone: String,
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    const existingAdmin = await User.findOne({ email: 'admin@artzyra.com' });
    
    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@artzyra.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+94771234567',
      });
      console.log('✅ Admin user created');
    }

    console.log('\nLogin Credentials:');
    console.log('Email: admin@artzyra.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected');
  }
}

createAdminUser();
