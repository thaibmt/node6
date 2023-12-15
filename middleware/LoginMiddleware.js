// middleware/checkAuth.js

module.exports = (req, res, next) => {
    if (!req.session.user) {
        req.session.error = "Bạn chưa đăng nhập!";
        return res.redirect('login');
    }
    return next();
};
