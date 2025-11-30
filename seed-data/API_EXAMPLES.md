# Artist Seed Data - API Request Examples

## POST /api/auth/register/artist

Below are example POST requests for registering artists via your API endpoint.

### Classic Dance Artists

```bash
# Artist 1: Priya Nataraj
curl -X POST http://localhost:3000/api/auth/register/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Nataraj",
    "email": "priya.nataraj@artzyra.com",
    "password": "SecurePass123!",
    "phone": "+94771234501",
    "bio": "Bharatanatyam specialist with 15 years of experience in classical Indian dance.",
    "category": "692be206a77228c53f60c83a",
    "skills": ["Bharatanatyam", "Kathak", "Classical Choreography", "Temple Dance", "Mudras"],
    "hourlyRate": 5000,
    "availability": {
      "days": ["Monday", "Wednesday", "Friday", "Saturday"],
      "timeRanges": [{"start": "09:00", "end": "17:00"}]
    }
  }'

# Artist 2: Lakshmi Venkatesh
curl -X POST http://localhost:3000/api/auth/register/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lakshmi Venkatesh",
    "email": "lakshmi.venkatesh@artzyra.com",
    "password": "SecurePass123!",
    "phone": "+94771234502",
    "bio": "Kathakali performer and instructor with expertise in traditional Kerala dance forms.",
    "category": "692be206a77228c53f60c83a",
    "skills": ["Kathakali", "Mohiniyattam", "Traditional Makeup", "Storytelling", "Classical Music"],
    "hourlyRate": 4500,
    "availability": {
      "days": ["Tuesday", "Thursday", "Saturday", "Sunday"],
      "timeRanges": [{"start": "10:00", "end": "18:00"}]
    }
  }'
```

### DJ Artists

```bash
# Artist 6: DJ Ravi Beats
curl -X POST http://localhost:3000/api/auth/register/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DJ Ravi Beats",
    "email": "dj.ravi@artzyra.com",
    "password": "SecurePass123!",
    "phone": "+94771234506",
    "bio": "Professional DJ with 10+ years experience in weddings, corporate events, and nightclubs.",
    "category": "692be206a77228c53f60c83b",
    "skills": ["EDM", "Bollywood Remixes", "House Music", "Mixing & Scratching", "Event Management"],
    "hourlyRate": 8000,
    "availability": {
      "days": ["Friday", "Saturday", "Sunday"],
      "timeRanges": [{"start": "18:00", "end": "02:00"}]
    }
  }'
```

### Dancer Artists

```bash
# Artist 11: Nisha Fernandez
curl -X POST http://localhost:3000/api/auth/register/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nisha Fernandez",
    "email": "nisha.fernandez@artzyra.com",
    "password": "SecurePass123!",
    "phone": "+94771234511",
    "bio": "Contemporary dancer and choreographer. Specializes in hip-hop, jazz, and fusion styles.",
    "category": "692be206a77228c53f60c83c",
    "skills": ["Hip Hop", "Jazz", "Contemporary", "Choreography", "Stage Performance"],
    "hourlyRate": 4000,
    "availability": {
      "days": ["Monday", "Tuesday", "Thursday", "Saturday"],
      "timeRanges": [{"start": "10:00", "end": "18:00"}]
    }
  }'
```

### Design Artists

```bash
# Artist 16: Arjun Krishnan
curl -X POST http://localhost:3000/api/auth/register/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arjun Krishnan",
    "email": "arjun.krishnan@artzyra.com",
    "password": "SecurePass123!",
    "phone": "+94771234516",
    "bio": "UI/UX designer with 8 years experience creating intuitive digital experiences.",
    "category": "692be206a77228c53f60c83d",
    "skills": ["UI/UX Design", "Figma", "Adobe XD", "User Research", "Prototyping"],
    "hourlyRate": 6000,
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "timeRanges": [{"start": "09:00", "end": "18:00"}]
    }
  }'
```

### Musician Artists

```bash
# Artist 21: Aditya Menon
curl -X POST http://localhost:3000/api/auth/register/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aditya Menon",
    "email": "aditya.menon@artzyra.com",
    "password": "SecurePass123!",
    "phone": "+94771234521",
    "bio": "Professional guitarist and music composer. Specializes in acoustic performances.",
    "category": "692be206a77228c53f60c83e",
    "skills": ["Guitar", "Music Composition", "Acoustic Performance", "Recording", "Live Performance"],
    "hourlyRate": 4500,
    "availability": {
      "days": ["Friday", "Saturday", "Sunday"],
      "timeRanges": [{"start": "18:00", "end": "23:00"}]
    }
  }'
```

### Painter Artists

```bash
# Artist 26: Maya Krishnan
curl -X POST http://localhost:3000/api/auth/register/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maya Krishnan",
    "email": "maya.krishnan@artzyra.com",
    "password": "SecurePass123!",
    "phone": "+94771234526",
    "bio": "Watercolor artist specializing in landscapes and portraits.",
    "category": "692be206a77228c53f60c83f",
    "skills": ["Watercolor", "Landscape Painting", "Portrait Art", "Custom Artwork", "Fine Art"],
    "hourlyRate": 3500,
    "availability": {
      "days": ["Monday", "Wednesday", "Friday"],
      "timeRanges": [{"start": "10:00", "end": "17:00"}]
    }
  }'
```

### Photographer Artists

```bash
# Artist 31: Amit Singh
curl -X POST http://localhost:3000/api/auth/register/artist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amit Singh",
    "email": "amit.singh.photo@artzyra.com",
    "password": "SecurePass123!",
    "phone": "+94771234531",
    "bio": "Wedding photographer with 12 years experience. Captures candid moments and creates timeless memories.",
    "category": "692be206a77228c53f60c840",
    "skills": ["Wedding Photography", "Candid Shots", "Portrait Photography", "Photo Editing", "Drone Photography"],
    "hourlyRate": 7000,
    "availability": {
      "days": ["Friday", "Saturday", "Sunday"],
      "timeRanges": [{"start": "08:00", "end": "22:00"}]
    }
  }'
```

## Batch Registration Script

You can also use this Node.js script to register all artists via API:

```javascript
const axios = require('axios');
const artists = require('./artists.json');

const API_URL = 'http://localhost:3000/api/auth/register/artist';

async function registerArtists() {
  let successCount = 0;
  let failCount = 0;

  for (const artist of artists) {
    try {
      const response = await axios.post(API_URL, {
        name: artist.name,
        email: artist.email,
        password: artist.password,
        phone: artist.phone,
        bio: artist.bio,
        category: artist.category,
        skills: artist.skills,
        hourlyRate: artist.hourlyRate,
        availability: artist.availability
      });
      console.log(`✅ Registered: ${artist.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed: ${artist.name}`, error.response?.data || error.message);
      failCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${artists.length}`);
}

registerArtists();
```

## Summary

- **Total Categories:** 7
- **Total Artists:** 45
- **Artists per Category:** 5-10
- **All passwords:** SecurePass123! (should be hashed by backend)
- **All artists:** Pre-approved (status: "approved")
