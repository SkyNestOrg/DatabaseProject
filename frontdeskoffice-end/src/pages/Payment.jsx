// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import checkAuth from './checkAuth';

// function Payment() {
//   const [bookingId, setBookingId] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('cash');
//   const [paidAmount, setPaidAmount] = useState('');
//   const [message, setMessage] = useState('');
//   const [billData, setBillData] = useState(null);
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

//   const handleMakePayment = async () => {
//     setMessage('');
//     try {
//       const response = await axios.post(`/frontdesk/payments/makePayment/${bookingId}`, {
//         payment_method: paymentMethod,
//         paid_amount: paidAmount
//       }, {
//         headers: { 'x-access-token': localStorage.getItem('token') }
//       });
//       setMessage(response.data.message || 'Payment made successfully');
//     } catch (error) {
//       setMessage('Error making payment');
//     }
//   };

//   const handleCancelPayment = async () => {
//     setMessage('');
//     try {
//       const response = await axios.post(`/frontdesk/payments/cancelPayment/${bookingId}`, {}, {
//         headers: { 'x-access-token': localStorage.getItem('token') }
//       });
//       setMessage(response.data.message || 'Last payment cancelled');
//     } catch (error) {
//       setMessage('Error cancelling payment');
//     }
//   };

//   const handleViewBill = async () => {
//     setMessage('');
//     setBillData(null);
//     try {
//       const response = await axios.get(`/frontdesk/payments/bills/${bookingId}`, {
//         headers: { 'x-access-token': localStorage.getItem('token') }
//       });
//       setBillData(response.data);
//     } catch (error) {
//       setMessage('Error viewing bill');
//     }
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f6f9fc, #dbe9f4)',
//       padding: '2rem',
//     },
//     form: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '1rem',
//       width: '300px',
//     },
//     input: {
//       padding: '0.5rem',
//       borderRadius: '4px',
//       border: '1px solid #ccc',
//     },
//     select: {
//       padding: '0.5rem',
//       borderRadius: '4px',
//       border: '1px solid #ccc',
//     },
//     button: {
//       padding: '0.5rem',
//       backgroundColor: '#1abc9c',
//       color: 'white',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//     },
//     bill: {
//       marginTop: '2rem',
//       whiteSpace: 'pre-wrap',
//     },
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <h2>Payment Management</h2>
//       <form style={styles.form}>
//         <input
//           style={styles.input}
//           type="text"
//           placeholder="Booking ID"
//           value={bookingId}
//           onChange={(e) => setBookingId(e.target.value)}
//           required
//         />
//         <select
//           style={styles.select}
//           value={paymentMethod}
//           onChange={(e) => setPaymentMethod(e.target.value)}
//         >
//           <option value="cash">Cash</option>
//           <option value="card">Card</option>
//           <option value="online">Online</option>
//         </select>
//         <input
//           style={styles.input}
//           type="number"
//           placeholder="Paid Amount"
//           value={paidAmount}
//           onChange={(e) => setPaidAmount(e.target.value)}
//           required
//         />
//         <button type="button" style={styles.button} onClick={handleMakePayment}>Make Payment</button>
//         <button type="button" style={styles.button} onClick={handleCancelPayment}>Cancel Last Payment</button>
//         <button type="button" style={styles.button} onClick={handleViewBill}>View Bill</button>
//       </form>
//       {message && <p>{message}</p>}
//       {billData && (
//         <div style={styles.bill}>
//           <h3>Bill Details</h3>
//           <pre>{JSON.stringify(billData, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Payment;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkAuth from '../checkAuth';

function Payment() {
  const [bookingId, setBookingId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(data => {
      if (!data.success) navigate('/frontofficelogin');
      setLoading(false);
    });
  }, [navigate]);

  const handlePayment = async () => {
    try {
      await axios.post(`/frontdesk/payments/makePayment/${bookingId}`, {
        payment_method: 'cash',
        paid_amount: amount
      }, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      setMessage('Payment successful!');
    } catch (err) {
      setMessage('Payment failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>Payment</h2>
      <div style={styles.form}>
        <input placeholder="Booking ID" value={bookingId} onChange={(e) => setBookingId(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={handlePayment}>Make Payment</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '8px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px' }
};

export default Payment;