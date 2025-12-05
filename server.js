const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Models
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/birdApp')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// 2. Settings
app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));

// 3. Session Config
app.use(session({
    secret: 'secretkey123',
    resave: false,
    saveUninitialized: false
}));

app.use(async (req, res, next) => {
    res.locals.currentUser = null;
    if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        res.locals.currentUser = user; 
    }
    next();
});

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1200000 },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only (JPEG, JPG, PNG)!');
    }
}

// --- ROUTES ---

app.get('/', (req, res) => res.render('index'));

// Register
app.get('/register', (req, res) => res.render('register'));

// --- BURASI DEĞİŞTİ: OTOMATİK ADMİN ATAMA ---
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // KURAL: Eğer kullanıcı adı "admin" ise isAdmin = true olsun.
        // Başka bir isim kullanmak istersen 'admin' yazısını değiştirebilirsin.
        let isAdmin = false;
        if (username === 'admin') {
            isAdmin = true;
        }

        const user = new User({ username, password, isAdmin: isAdmin });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.send("Registration Error: Username already taken.");
    }
});

// Login
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/board');
    } else {
        res.send("Invalid Username or Password!");
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// Add Post
app.get('/add-post', (req, res) => {
    if(!req.session.userId) return res.redirect('/login');
    res.render('add-post');
});

app.post('/add-post', upload.single('image'), async (req, res) => {
    if(!req.session.userId) return res.redirect('/login');
    try {
        const newPost = new Post({
            username: res.locals.currentUser.username,
            location: req.body.location,
            date: req.body.date,
            time: req.body.time,
            bird: req.body.bird,
            activity: req.body.activity,
            duration: req.body.duration,
            description: req.body.description,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        });
        await newPost.save();
        res.redirect('/board'); 
    } catch (err) {
        res.send("Error Saving Post: " + err);
    }
});

// Board & Search (YETKİ KONTROLÜ)
app.get('/board', async (req, res) => {
    if(!req.session.userId) return res.redirect('/login');

    let filter = {};

    // 1. Arama Filtresi
    if(req.query.search) {
        filter.bird = new RegExp(req.query.search, 'i');
    }

    // 2. Yetki Filtresi
    // Eğer Admin DEĞİLSE, sadece kendi eklediklerini görsün.
    if (res.locals.currentUser.isAdmin === false) {
        filter.username = res.locals.currentUser.username;
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.render('board', { posts: posts });
});

// Delete
app.get('/delete/:id', async (req, res) => {
    if(!req.session.userId) return res.redirect('/login');
    try {
        const post = await Post.findById(req.params.id);
        
        // Sadece sahibi silebilir
        if(post.username === res.locals.currentUser.username) {
            await Post.findByIdAndDelete(req.params.id);
            res.redirect('/board');
        } else {
            res.send("Unauthorized Action!");
        }
    } catch (err) {
        res.send("Error: " + err);
    }
});

// Edit Routes
app.get('/edit/:id', async (req, res) => {
    if(!req.session.userId) return res.redirect('/login');
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === res.locals.currentUser.username) {
            res.render('edit-post', { post: post });
        } else {
            res.send("You cannot edit this post!");
        }
    } catch (err) {
        res.redirect('/board');
    }
});

app.post('/edit/:id', upload.single('image'), async (req, res) => {
    if(!req.session.userId) return res.redirect('/login');
    try {
        let updateData = {
            location: req.body.location,
            bird: req.body.bird,
            date: req.body.date,
            time: req.body.time,
            duration: req.body.duration,
            description: req.body.description
        };

        if(req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        await Post.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/board');
    } catch (err) {
        res.send("Update Error: " + err);
    }
});

// Reset DB
app.get('/reset', async (req, res) => {
    await User.deleteMany({});
    await Post.deleteMany({});
    res.send("Database has been reset. You can now register as 'admin'.");
});

app.listen(3000, () => {
    console.log('🚀 Server Running: http://localhost:3000');
});