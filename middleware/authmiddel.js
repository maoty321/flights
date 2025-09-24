const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    const token = req.cookies.auth;

    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded.payload; 
        next();
    } catch (error) {
        console.error(error);
        res.redirect('/admin/login');
    }
};


module.exports = authUser