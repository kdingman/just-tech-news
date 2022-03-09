// authguard (middleware) a route means to restrict it to authenticated users only
// this function will act as a normal request callback function, checking for existence
// of a session property using res.redirect() if it's not there

const withAuth = (req, res, next) => {
    // if req.session.user_id does not exist, it will call next()
    if(!req.session.user_id) {
        res.redirect('/login');
    }
    else {
        next(); // calls the next middleware function, passing along the same req and res values
    }
};

module.exports = withAuth;