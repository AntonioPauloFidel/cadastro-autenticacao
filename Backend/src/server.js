const express = require('express');
const cors    = require('cors');
const path    = require('path');
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
}

app.use(express.json());
app.use('/api/auth', authRoutes);

if (isProd) {
  const distPath = path.join(__dirname, '..', '..', 'Frontend', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ errors: [{ msg: 'Rota não encontrada.' }] });
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});