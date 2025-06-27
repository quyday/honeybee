const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // dùng TLS
  auth: {
    user: 'nguyencongquy13@gmail.com',
    pass: 'muuu yiwn cktv bzcc'
  }
});

async function sendOrderNotification(order) {
  const mailOptions = {
    from: 'nguyencongquy13@gmail.com',
    to: 'nguyencongquy13@gmail.com', // Gửi cho chính bạn
    subject: `Đơn hàng mới từ ${order.name}`,
    html: `
      <h2>Đơn hàng mới</h2>
      <p><b>Tên:</b> ${order.name}</p>
      <p><b>SĐT:</b> ${order.phone}</p>
      <p><b>Địa chỉ:</b> ${order.address}</p>
      <p><b>Phương thức:</b> ${order.payment}</p>
      <p><b>Tổng tiền:</b> ${order.total.toLocaleString('vi-VN')} vnđ</p>
      <h3>Sản phẩm:</h3>
      <ul>
        ${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
      </ul>
    `
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendOrderNotification; 