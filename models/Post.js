const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    username: String,   // Gönderiyi yapan kişi
    location: String,   // Bölge (Erean, Brunad vb.)
    date: String,       // Gözlem Tarihi
    time: String,       // Gözlem Saati
    bird: String,       // Kuş Türü (Wood Pigeon vb.)
    activity: String,   // Ne yapıyordu? (Beslenme vb.)
    duration: Number,   // Kaç dakika sürdü
    description: String,// Serbest yorumlar
    image: String,      // Fotoğrafın dosya yolu
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);