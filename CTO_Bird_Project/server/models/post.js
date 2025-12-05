// server/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Gönderiyi yapan kişi [cite: 28]
  location: { type: String, required: true }, // Bölge (Centrala areas) [cite: 29]
  date: { type: String, required: true },     // Gözlem tarihi [cite: 31]
  time: { type: String, required: true },     // Gözlem saati [cite: 30]
  bird: { type: String, required: true },     // Kuş türü [cite: 32]
  activity: { type: String, required: true }, // Aktivite (feeding, nesting vs.) [cite: 33]
  duration: { type: Number, required: true }, // Süre (dakika) [cite: 34]
  comments: { type: String },                 // Yorumlar [cite: 35]
  imagePath: { type: String },                // Yüklenen resmin dosya yolu [cite: 36]
  createdAt: {
    type: Date,
    default: Date.now // Gönderi oluşturulma zamanı otomatik eklenir
  }
});

module.exports = mongoose.model('Post', PostSchema);