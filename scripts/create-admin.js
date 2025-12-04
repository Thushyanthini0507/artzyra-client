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
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@artzyra.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('📧 Email: admin@artzyra.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role:', existingAdmin.role);
      
      // Update to ensure it's admin role
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated user role to admin');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@artzyra.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+94771234567',
      });

      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@artzyra.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role:', admin.role);
    }

    console.log('\n🎯 Next steps:');
    console.log('1. Go to http://localhost:3000/auth/login (or :3001)');
    console.log('2. Login with:');
    console.log('   Email: admin@artzyra.com');
    console.log('   Password: admin123');
    console.log('3. Navigate to /admin/categories');
    console.log('4. You should now be able to create categories!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️  Admin user already exists in database');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

createAdminUser();
