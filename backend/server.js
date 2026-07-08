const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const socketIO = require('socket.io');
const socket = require('./socket');
const io = socketIO(server, { cors: { origin: '*' } });
socket.init(io);

const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const orderKitchenDashboardRoutes = require('./routes/kitchen-dashboard')


app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes(io));
app.use('/api/kitchen-dashboard', orderKitchenDashboardRoutes);

const paymentRoutes = require('./routes/payment');
const generateQr = require('./routes/generate-qr');

app.use('/api/payment-link', paymentRoutes);
app.use('/api/generate-qr', generateQr);
app.get("/", (req, res) => {
  res.send("Deployed version v2 🚀");
});


const PORT = process.env.PORT || 3000;
server.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

