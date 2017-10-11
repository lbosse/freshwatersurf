module.exports = function(app, passport) {

    // =====================================
    // TEST ================================
    // =====================================
    app.get('/', function(req,res) {
        res.json({hello: 'hello, world!'});
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/',
        failureFlash : true // allow flash messages
    }));

   /* 
    app.post('/login', function(req, res){
  console.log("body parsing", req.body);
  //should be something like: {username: YOURUSERNAME, password: YOURPASSWORD}
});
*/


    // =====================================
    // SIGNUP ==============================
    // =====================================

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/',
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
