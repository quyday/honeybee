const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRoute = require('./routes/order');

const app = express();
const PORT = 5001;

// Cho phép frontend kết nối (CORS)
app.use(cors());
app.use(bodyParser.json());

// Route API đặt hàng
app.use('/api/order', orderRoute);

// Route test
app.get('/', (req, res) => {
  res.send('Kimi backend is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
}); 