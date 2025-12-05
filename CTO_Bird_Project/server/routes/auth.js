// server/routes/auth.js
const router = require('express').Router();
const User = require('../models/user'); // user.js (küçük harfli) dosyanızı çağırır
const CryptoJS = require('crypto-js'); // Yeni şifreleme kütüphanesi

// 1. REGISTER (KAYIT OLMA) ROTASI
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Şifreyi SHA256 ile hash'le (Karmaşıklaştır)
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Yeni kullanıcıyı oluştur
    const newUser = new User({
      username: username,
      password: hashedPassword, // Hash'lenmiş şifreyi kaydet
    });

    // Veritabanına kaydet
    const user = await newUser.save();
    
    res.status(200).json(user);
  } catch (err) {
    // Hata (örn: aynı kullanıcı adı varsa veya DB izni yoksa)
    res.status(500).json(err);
  }
});

// 2. LOGIN (GİRİŞ YAPMA) ROTASI
router.post('/login', async (req, res) => {
  try {
    // 1. Kullanıcı adını veritabanında ara
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("Kullanıcı bulunamadı!");
    }

    // 2. Girilen şifreyi aynı algoritma ile hash'le
    const inputHashedPassword = CryptoJS.SHA256(req.body.password).toString();

    // 3. Hash'lenmiş şifreleri doğrudan kontrol et
    if (inputHashedPassword !== user.password) {
      return res.status(400).json("Yanlış şifre!");
    }

    // Başarılı giriş
    const { password, ...others } = user._doc;
    res.status(200).json(others);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;