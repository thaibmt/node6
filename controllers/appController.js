const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require('../models/user')
const Clothes = require('../models/clothes')
const checkLogin = require('../middleware/LoginMiddleware');
const checkRole = require('../middleware/AdminMiddleware');
// Home page
router.get('/', (req, res) => {
    res.render('home');
});
// Login - logout - register
router.get('/login', (req, res) => {
    let error = req.session.error;
    delete req.session.error;
    if (req.session.user) {
        return res.redirect("/admin");
    }
    res.render('login', { error, email: '' });
});
router.get('/register', (req, res) => {
    res.render('register', { error: '', email: '', username: '' });
});
router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            throw error;
        }
        res.redirect("/");
    });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.session.error = "Thông tin đăng nhập không đúng.";
            return res.redirect("/login");
        }
        const hasUser = await bcrypt.compare(password, user.password);
        if (!hasUser) {
            req.session.error = "Thông tin đăng nhập không đúng.";
            return res.redirect("/login");
        }
        req.session.user = user;
        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.redirect('/login', { error: 'Email hoặc mật khẩu không đúng', email });
    }
});
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Tìm người dùng xem tồn tại chưa
        let user = await User.findOne({ email, password });
        if (user) {
            return res.render('/register', { error: 'Nguời dùng đã tồn tại', email });
        }
        const salt = await bcrypt.genSalt(10);
        // mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.redirect("/login");
    } catch (error) {
        res.redirect('/register', { error: 'Có lỗi xảy ra khi đăng ký', email });
    }
});
// Admin
router.get('/admin', checkLogin, async (req, res) => {

    const username = req.session.user.name;
    const role = req.session.user.role;
    const error = req.session.error;
    const success = req.session.success;
    const clothess = await Clothes.find({});
    delete req.session.error;
    delete req.session.success;
    res.render("admin", { clothess: clothess, username: username, role: role, error: error, success: success });
});
// Detail
router.get('/clothess/:id', checkLogin, async (req, res) => {
    const id = req.params.id;
    const clothes = await Clothes.findOne({ _id: id });
    res.render("detail", { clothes: clothes });
});
router.post('/clothess/delete/:id', checkLogin, checkRole, async (req, res) => {
    const id = req.params.id;
    try {
        await Clothes.deleteOne({ _id: id });
        req.session.success = true
    } catch (err) {
        req.session.error = true
    }
    res.redirect("/admin");
});
router.post('/clothess', checkLogin, checkRole, async (req, res) => {
    const { title, price, description } = req.body;
    let clothes = new Clothes({
        title,
        price,
        description
    });
    try {
        await clothes.save();
        req.session.success = true
    } catch (err) {
        console.log(err)
        req.session.error = true
    }
    res.redirect("/admin");
});
router.post('/clothess/update/:id', checkLogin, checkRole, async (req, res) => {
    const { title, price, description } = req.body;
    const id = req.params.id;
    try {
        await Clothes.updateOne({ _id: id }, { title, price, description });
        req.session.success = true
    } catch (err) {
        req.session.error = true
    }
    res.redirect("/admin");
});
module.exports = router;
