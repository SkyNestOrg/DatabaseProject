import axios from 'axios';

async function checkAuth() {
  try {
    const res = await axios.get('/frontofficetokenauth', {
      headers: { 'x-access-token': localStorage.getItem('token') }
    });
    return res.data;
  } catch (err) {
    return { success: false };
  }
}

export default checkAuth;