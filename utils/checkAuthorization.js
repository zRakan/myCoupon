export default function(req, res, next) {
    const session = req.session;
    
    if(session.loggedIn) return next();
    return res.sendStatus(401);
}