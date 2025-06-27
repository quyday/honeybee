const express = require('express');
const router = express.Router();
const sendOrderNotification = require('../utils/sendMail');

router.post('/', async (req, res) => {
  const order = req.body;
  try {
    await sendOrderNotification(order);
    res.status(200).json({ message: 'Đặt hàng thành công!' });
  } catch (err) {
    console.error('Lỗi gửi email:', err);
    res.status(500).json({ message: 'Lỗi gửi email!' });
  }
});

module.exports = router; 