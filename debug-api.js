
const axios = require('axios');

const API_URL = 'http://localhost:5000';
const TARGET_ID = '693388526aaf282a39c938a4'; 

async function probe() {
  console.log(`1. Logging in as admin...`);
  let token;
  try {
    const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
      email: "testadmin@artzyra.com",
      password: "password123"
    });
    token = loginRes.data.token || loginRes.data.data.token;
    console.log(`✅ Login success! Token: ${token.substring(0, 20)}...`);
  } catch (err) {
    console.log(`❌ Login failed: ${err.message}`);
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  console.log(`\n2. Hunting for ID: ${TARGET_ID}...`);

  // Try to fetch the specific user by ID
  const idEndpoints = [
    `/api/admin/users/${TARGET_ID}`,
    `/api/admin/artists/${TARGET_ID}`,
    `/api/admin/pending/${TARGET_ID}`,
    `/api/users/${TARGET_ID}`,
    `/api/artists/${TARGET_ID}`
  ];

  for (const endpoint of idEndpoints) {
    try {
      console.log(`Testing ID endpoint: ${endpoint}`);
      const res = await axios.get(`${API_URL}${endpoint}`, { headers });
      console.log(`✅ Success (${res.status})`);
      console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
       console.log(`❌ Failed (${err.response ? err.response.status : 'Network Error'}): ${err.message}`);
    }
  }

  // Try list endpoints with more roles
  const roles = ['artist', 'pending', 'pending_artist', 'candidate', 'applicant', 'user', 'all', ''];
  
  for (const role of roles) {
    const endpoint = `/api/admin/users?role=${role}`;
    try {
      console.log(`Testing role: ${role} (${endpoint})`);
      const res = await axios.get(`${API_URL}${endpoint}`, { headers });
      const data = res.data.data || res.data;
      if (Array.isArray(data)) {
        console.log(`✅ Success: Found ${data.length} items`);
        const found = data.find(i => i._id === TARGET_ID || i.id === TARGET_ID);
        if (found) {
            console.log('🎯 FOUND TARGET IN LIST!');
            console.log('Target Status:', found.status);
            console.log('Target Role:', found.role);
        }
      } else {
        console.log(`✅ Success: Not an array`, JSON.stringify(data).substring(0, 50));
      }
    } catch (err) {
       console.log(`❌ Failed: ${err.response ? err.response.status : err.message}`);
    }
  }
}

probe();
