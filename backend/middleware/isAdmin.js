export function isAdmin(req, res, next) {

    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "You must be logged in." })
    }

    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Bratz Pack only 💅" })
    }

    next()
}