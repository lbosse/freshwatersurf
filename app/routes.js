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
    /*    
        // process the login form
    app.post('/login', passport.authenticate('local-login'), 
    function(req,res) {
        if (req.user) {
            console.log('login successful. user: ' + req.user);
            res.json({ authenticated : true, message : req.loginMessage });
        }
        else {
            console.log('login unsuccessful');
            res.json({ authenticaed : false, message : req.loginMessage });
        }
    }
    );
    */
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                // *** Display message without using flash option
                // re-render the login form with a message
                return res.json({ authenticated : false, message: info.message })
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.json({ authenticated : true });
            });
        })(req, res, next);
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================

    // process the signup form
    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                // *** Display message without using flash option
                // re-render the login form with a message
                return res.json({ authenticated : false, message: info.message });
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.json({ authenticated : true });
            });
        })(req, res, next);
    });
        /*
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/',
        failureFlash : true // allow flash messages
    }));
    */

        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });

        // route middleware to make sure a user is logged in
        function isLoggedIn(req, res, next) {

            // if user is authenticated in the session, carry on 
            if (req.isAuthenticated())
                return next();

            // if they aren't redirect them to the home page
            res.redirect('/');
        }
}
