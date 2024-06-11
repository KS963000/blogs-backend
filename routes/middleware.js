const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.sendStatus(403);
        }

        console.log(user)
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        req.userId = user.id;
        next();
    });
};

module.exports = authenticateToken;
