export default function(req, res, next) {
    const session = req.session;
    
    if(session.loggedIn && session.role == "admin") return next();
    return res.sendStatus(403);
}