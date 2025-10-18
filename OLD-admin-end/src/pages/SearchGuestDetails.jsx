// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import checkAuth from './checkAuth';

// function SearchGuestDetails() {
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const authenticate = async () => {
//       const data = await checkAuth();
//       if (!data.success) {
//         navigate('/frontofficelogin');
//       }
//       setLoading(false);
//     };
//     authenticate();
//   }, [navigate]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//       <h2>Search Guest Details - Feature Coming Soon</h2>
//     </div>
//   );
// }

// export default SearchGuestDetails;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import checkAuth from '../checkAuth';

function SearchGuestDetails() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(data => {
      if (!data.success) navigate('/frontofficelogin');
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>Search Guest Details</h2>
      <p>Feature coming soon!</p>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }
};

export default SearchGuestDetails;