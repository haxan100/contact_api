const express = require('express');
const app = express();

const authRoutes = require('./src/routes/authRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
app.use(express.json()); // Middleware untuk parsing JSON

app.get('/', (req, res) => {
  res.send('Hello from Contact API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
