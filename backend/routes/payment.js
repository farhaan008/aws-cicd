const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/:orderId', (req, res) => {
  const { orderId } = req.params;

  db.all(
    `SELECT mi.price, oi.quantity FROM order_items oi JOIN menu_items mi ON mi.id = oi.item_id WHERE oi.order_id = ?`,
    [orderId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to calculate total' });

      const total = rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const upiId = "farhaaniit80@oksbi";
      const upiLink = `upi://pay?pa=${upiId}&pn=MOHDFARHAN&am=${total}&cu=INR&tn=Order+123&tr=order123`; // &tn=Order%20${orderId}&tr=${orderId}
      const qrLink = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=200x200`;
      // upi://pay?pa=farhaaniit80@oksbi&pn=RR%20Cafe&am=200&cu=INR
      // upi://pay?pa=yourname@upi&pn=My+Restaurant&am=150&cu=INR&tn=Order+123&tr=order123
      // https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=farhaaniit80@oksbi&pn=RR%20Cafe&am=200&cu=INR&size=200x200


      res.json({ amount: total, upi_link: upiLink, qr_image: qrLink });
    }
  );
});

module.exports = router;

// Confirm Payment Manually (Offline or via Callback/Webhook)
// app.post('/order/:orderId/confirm', (req, res) => {
//   const { orderId } = req.params;

//   db.run(`UPDATE orders SET status = 'paid' WHERE id = ?`, [orderId], function(err) {
//     if (err) return res.status(500).send("Update failed");
//     res.json({ message: "Payment confirmed" });
//   });
// });



// npm install qrcode
// server.js
// const express = require('express');
// const QRCode = require('qrcode');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.post('/generate-qr', async (req, res) => {
//   const { amount, orderId } = req.body;

//   const upiId = 'yourname@upi';
//   const name = 'My Restaurant';
//   const transactionNote = `Order ${orderId}`;

//   const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${orderId}`;

//   try {
//     const qrDataUrl = await QRCode.toDataURL(upiLink);
//     res.json({ qr: qrDataUrl });
//   } catch (err) {
//     res.status(500).json({ error: 'QR generation failed' });
//   }
// });

// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

// PayU
// npm install express axios crypto cors dotenv


// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const crypto = require('crypto');
// const app = express();
// app.use(express.json());
// app.use(cors());

// function generateHash(key, txnid, amount, productinfo, firstname, email, salt) {
//   const txt = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||${salt}`;
//   return crypto.createHash('sha512').update(txt).digest('hex');
// }

// app.post('/api/create-qr', async (req, res) => {
//   const { amount, txnid, firstname, email, phone, productinfo } = req.body;
//   const data = {
//     key: process.env.PAYU_KEY,
//     txnid,
//     amount: amount.toFixed(2),
//     productinfo: productinfo || 'UPI QR Payment',
//     firstname,
//     email,
//     phone,
//     pg: 'DBQR',
//     bankcode: 'UPIDBQR',
//     udf1: req.body.udf1 || '',
//   };
//   data.hash = generateHash(data.key, data.txnid, data.amount, data.productinfo, data.firstname, data.email, process.env.PAYU_SALT);

//   const form = new URLSearchParams(data).toString();
//   try {
//     const resp = await axios.post(
//       process.env.PAYU_URL, form,
//       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//     );
//     // parse response XML/JSON as per PayU API
//     res.json(resp.data);
//   } catch (err) {
//     res.status(500).json({ error: err.message, data: err.response?.data });
//   }
// });

// app.post('/api/verify', async (req, res) => {
//   // implement PayU verify_payment API if needed
//   res.json({ status: 'OK' });
// });

// app.listen(4000, () => console.log('Backend at http://localhost:4000'));



// <template>
//   <div>
//     <button @click="createQr">Generate UPI QR</button>
//     <div v-if="qrData">
//       <img :src="qrData.image" alt="UPI QR" />
//       <p>Scan using UPI app to pay ₹{{ amount }}</p>
//     </div>
//   </div>
// </template>

// <script setup>
// import { ref } from 'vue';
// import axios from 'axios';

// const qrData = ref(null);
// const amount = ref(499.00);

// const createQr = async () => {
//   const txnid = 'order_' + Date.now();
//   try {
//     const resp = await axios.post('http://localhost:4000/api/create-qr', {
//       amount: amount.value,
//       txnid,
//       firstname: 'TestUser',
//       email: 'user@example.com',
//       phone: '9999999999',
//     });
//     // resp.data.result.qrString and resp.data.result.paymentId etc.
//     qrData.value = {
//       image: resp.data.result.qrString
//         ? `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(resp.data.result.qrString)}`
//         : null
//     };
//   } catch (err) {
//     console.error(err);
//   }
// };
// </script>

