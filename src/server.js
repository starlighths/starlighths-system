const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});