const isOwnser = (req, res, next) => {
    
    if (req.session.currentUser) {
        next(); // execute the next action for this route
    }
    else {
        return res.redirect('/auth/login');
    }
  
};

module.exports = {
    isOwnser
};