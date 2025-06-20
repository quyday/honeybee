const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email đã được đăng ký. Vui lòng dùng email khác.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Nếu đăng ký đúng email admin, set role admin
    const role = (email === 'quy113@gmail.com') ? 'admin' : 'user';
    const user = await User.create({ name, email, password: hashedPassword, role });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    // Nếu lỗi là do unique constraint (ví dụ email trùng), trả về thông báo rõ ràng
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email đã tồn tại trong hệ thống.' });
    }
    res.status(500).json({ error: 'Đăng ký thất bại: ' + err.message });
  }
});

// Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Nếu đăng nhập đúng email admin mà role chưa phải admin, cập nhật role
    if (email === 'quy113@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware xác thực JWT
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Lấy profile user hiện tại
app.get('/api/users/profile', auth, async (req, res) => {
  const user = await User.findByPk(req.userId, { attributes: ['id', 'name', 'email', 'role'] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Cập nhật profile user (tên, đổi mật khẩu)
app.put('/api/users/profile', auth, async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, currentPassword, newPassword } = req.body;
  if (name) user.name = name;
  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
  }
  await user.save();
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// Tạo user admin mặc định nếu chưa có
async function createDefaultAdmin() {
  const adminEmail = 'admin@kimi.com';
  const adminPassword = 'Admin@123'; // Mật khẩu mạnh
  const adminName = 'Admin';

  const existing = await User.findOne({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hash,
      role: 'admin'
    });
    console.log('Admin user created:', adminEmail, adminPassword);
  }
}

sequelize.sync().then(async () => {
  await createDefaultAdmin();
  app.listen(5000, () => console.log('Server running on port 5000'));
}); 