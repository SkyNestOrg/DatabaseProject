import axios from 'axios';

async function checkAuth() {
  try {
    const res = await axios.get('/frontofficetokenauth', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    });
    console.log(res.data.success);
    return res.data; // Return the full data object
  } catch (err) {
    console.log(err);
    return { success: false }; // Return a consistent shape
  }
}

export default checkAuth;