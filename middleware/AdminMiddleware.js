
module.exports = (req, res, next) => {
    if (req.session.user.role != 'admin') {
        req.session.error = "Bạn không phải là admin!";
        return res.redirect("/admin");
    }
    return next();
};