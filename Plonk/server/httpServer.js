const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// nhận commitment từ PI
app.post('/commitment', (req, res) => {
  const { commitment } = req.body;
  fs.writeFileSync('./commitment.json', JSON.stringify(commitment));
  console.log('Received commitment from PI:', commitment);
  res.json({ status: 'success', message: 'Commitment stored' });
});

//  nhận proof từ PI
app.post('/proof', (req, res) => {
  const { proof } = req.body;
  fs.writeFileSync('./proof.json', JSON.stringify(proof));
  console.log('Received proof from PI:', proof);
  res.json({ status: 'success', message: 'Proof stored' });
});

// Endpoint để PI lấy nonce
app.get('/nonce', (req, res) => {
  const nonce = Date.now().toString();
  fs.writeFileSync('./timestampNonce.json', nonce);
  
  // Thông báo chi tiết khi PI lấy nonce
  console.log('==========================================');
  console.log('PI REQUESTED NONCE');
  console.log('Time:', new Date().toLocaleString());
  console.log('Nonce generated:', nonce);
  console.log('PI IP:', req.ip || req.connection.remoteAddress);
  console.log('==========================================');
  
  res.json({ nonce: nonce });
});

app.listen(port, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
  console.log('Waiting for PI to connect...');
});
