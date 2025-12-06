
const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testRegistration() {
  const email = `test.artist.${Date.now()}@example.com`;
  const password = 'password123';
  const name = `Test Artist ${Date.now()}`;

  console.log(`Attempting to register artist: ${email}`);

  try {
    const res = await axios.post(`${API_URL}/api/auth/register/artist`, {
      email,
      password,
      name,
      shopName: `Shop ${Date.now()}`,
      category: '693272b35ddcea7d31eb4efc' // Animator
    });

    console.log('✅ Registration Success:', res.status);
    console.log('Response Data:', JSON.stringify(res.data, null, 2));

    // Now try to find this user via admin API
    // We need a token for admin API, but we don't have one easily here unless we login as admin.
    // But we can check if it appears in the public /api/artists list (if that exists/works)
    
    try {
        const listRes = await axios.get(`${API_URL}/api/artists`);
        const myArtist = listRes.data.data.find(a => a.email === email);
        if (myArtist) {
            console.log('✅ Found in public list:', JSON.stringify(myArtist, null, 2));
        } else {
            console.log('⚠️ Not found in public list (expected if pending)');
        }
    } catch (e) {
        console.log('Public list check failed:', e.message);
    }

  } catch (err) {
    console.log('❌ Registration Failed:', err.message);
    if (err.response) {
      console.log('Error Data:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

testRegistration();
