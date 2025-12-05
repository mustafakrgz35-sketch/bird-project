// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Rota dosyalarını import et
const authRoute = require('./routes/auth'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotaları Kullan (Middleware olarak ekle)
// "/api/auth" adresine gelen istekleri authRoute dosyasına yönlendir
app.use('/api/auth', authRoute);

// Veritabanı Bağlantısı
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  // Eski Mongoose sürümleri için ayarlar (opsiyonel ama zararsız)
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB veritabanına başarıyla bağlandı.'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Sunucu port ${PORT} üzerinde çalışıyor.`);
});