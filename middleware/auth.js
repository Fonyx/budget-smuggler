const clog = require('../utils/colorLogging');

/**
 * middleware function that redirects to login if user isn't logged in
 * @param {http req} req 
 * @param {http res} res 
 * @param {middleware call stack} next 
 */
const onlyIfLoggedIn = (req, res, next) => {
    // if user isn't logged in, redirect to /login route
    if(!req.session.logged_in){
        clog("User not logged in, redirecting to landing", 'red');
        res.render('landing');
    // otherwise call next to move through other middleware functions
    } else {
        // refresh the duration of the session cookie so it updates timeout to 5 minutes from now
        // req.session.cookie.expires = new Date(Date.now() + 20000);
        req.session.touch();
        next()
    }
}


module.exports = {
    onlyIfLoggedIn,
}