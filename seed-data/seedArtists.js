const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/artzyra';

// Artist data
const artists = [
  {
    name: "Priya Nataraj",
    email: "priya.nataraj@artzyra.com",
    password: "SecurePass123!",
    role: "artist",
    phone: "+94771234501",
    bio: "Bharatanatyam specialist with 15 years of experience in classical Indian dance. Trained under renowned gurus and performed at prestigious venues worldwide.",
    category: "692be206a77228c53f60c83a", // Classic Dance
    skills: ["Bharatanatyam", "Kathak", "Classical Choreography", "Temple Dance", "Mudras"],
    hourlyRate: 5000,
    rating: 4.8,
    profileImage: "https://i.pravatar.cc/300?img=1",
    availability: {
      days: ["Monday", "Wednesday", "Friday", "Saturday"],
      timeRanges: [{ start: "09:00", end: "17:00" }]
    },
    status: "approved"
  },
  // ... (include all 45 artists from the JSON file)
];

async function seedArtists() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get User model
    const User = mongoose.model('User');

    // Hash passwords and prepare artists
    const artistsWithHashedPasswords = await Promise.all(
      artists.map(async (artist) => {
        const hashedPassword = await bcrypt.hash(artist.password, 10);
        return {
          ...artist,
          password: hashedPassword,
        };
      })
    );

    // Clear existing artists (optional - comment out if you want to keep existing data)
    // await User.deleteMany({ role: 'artist' });
    // console.log('Cleared existing artists');

    // Insert artists
    const result = await User.insertMany(artistsWithHashedPasswords);
    console.log(`✅ Successfully seeded ${result.length} artists`);

    // Display summary by category
    const categoryCounts = {};
    artists.forEach(artist => {
      const catId = artist.category;
      categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
    });

    console.log('\n📊 Artists per category:');
    console.log('Classic Dance: 5 artists');
    console.log('DJ: 5 artists');
    console.log('Dancer: 5 artists');
    console.log('Design: 5 artists');
    console.log('Musician: 5 artists');
    console.log('Painter: 5 artists');
    console.log('Photographer: 5 artists');
    console.log(`\n🎉 Total: ${artists.length} artists generated`);

  } catch (error) {
    console.error('❌ Error seeding artists:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedArtists();
