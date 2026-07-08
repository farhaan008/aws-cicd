const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

router.post('/', async (req, res) => {
  const { amount } = req.body;
  const upiId = 'farhaaniit80@oksbi';
  const name = 'Mohammad Farhan';
  if ( !amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name || 'UPI User')}&am=${amount}&cu=INR`;
  try {
    const qrDataUrl = await QRCode.toDataURL(upiUri);
    res.json({ qr: qrDataUrl, upiUri });
  } catch (err) {
    res.status(500).json({ error: 'QR generation failed', err:err });
  }
});

module.exports = router;