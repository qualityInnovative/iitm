const auth = require("../utils/authenticate");
const query = require("../utils/db");

// Renders login page
exports.getLogin = (req, res, next) => {
  // Checks if there is any error to show
  const loginError = req.params.error
    ? req.params.error.split("_").join(" ")
    : null;

  // Checks if the user attempted to login previouly to load the input fields with prefilled values
  const valueUsername = req.params.username ? req.params.username : null;

  // If user is already logged in and tries to visit /login(get) route, redirect him to /cms else render the login view
  if (req.session.isLoggedIn) {
    res.redirect("/cms");
  } else {
    res.render("auth/login", {
      pageTitle: "CMS - Login",
      pageName: "IITM - CMS",
      isAuthenticated: req.session.isLoggedIn,
      loginError: loginError,
      username: valueUsername,
    });
  }
};

// Handles post login request
exports.postLogin = (req, res, next) => {
  query("SELECT salt FROM users WHERE username = ?", [req.body.username]).then(
    (result) => {
      if (result == "") {
        // User does't exist
        // If the salt doesn't exist that means the user with that username doesn't exist.
        // Redirect back to /login(get) with 'user not found' error and value of username to autofill on reload
        res.redirect(`/login/user_not_found/${req.body.username}`);
      } else {
        const UserSalt = result[0].salt;

        // Else hash the user entered password with the salt fetched from database
        auth
          .hashPassword(req.body.password, UserSalt)
          .then(({ hashedPassword }) => {
            // Fetch the password and userid that belongs to the user with entered username
            query("SELECT password, uid FROM users WHERE username = ?", [
              req.body.username,
            ]).then((result) => {
              // Check if the hashed password matches the password in database
              const UPass = result[0].password;
              if (UPass == hashedPassword) {
                // Start the session and store userid
                req.session.isLoggedIn = true;
                req.session.user = result[0].uid;
                //   And redirect to the dashboard
                res.redirect("/cms");
              } else {
                // Else if the password is incorrect redirect back to /login(get) with 'incorrect_password' error and value of username to autofill on reload
                res.redirect(`/login/incorrect_password/${req.body.username}`);
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  );
};

// Checks which user is logged in and redirects him to his admin panel
exports.CMSRedirect = (req, res, next) => {
  // If user isn't logged in then redirect to login page
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
  } else {
    // Else fetch username of the user from database to check which user is logged id
    let user;
    query("SELECT username FROM users WHERE uid = ?", [req.session.user])
      .then((result) => {
        user = result[0].username;
        // Checks which user is logged in to redirect him to his admin panel
        if (user == "admin@cms") {
          res.redirect("/cms/admin-cms");
        } else if (user == "admin@notifications") {
          res.redirect("/cms/admin-notifications");
        } else if (user == "admin@news") {
          res.redirect("/cms/admin-news");
        } else if (user == "admin@events") {
          res.redirect("/cms/admin-events");
        } else if (user == "admin@home") {
          res.redirect("/cms/admin-home");
        } else if (user == "so@iitm") {
          res.redirect("/cms/so-iitm");
        } else if (user == "pro@iitm") {
          res.redirect("/cms/pro-iitm");
        } else if (user == "gr@iitm") {
          res.redirect("/cms/gr-iitm");
        } else if (user == "po@iitm") {
          res.redirect("/cms/po-iitm");
        } else if (user == "admissions@iitm") {
          res.redirect("/cms/admissions-iitm");
        } else if (user == "hod@cs") {
          res.redirect("/cms/cs-hod");
        } else if (user == "hod@ms") {
          res.redirect("/cms/ms-hod");
        } else if (user == "coordinator@cs") {
          res.redirect("/cms/cs-coordinator");
        } else if (user == "coordinator@ms") {
          res.redirect("/cms/ms-coordinator");
        } else if (user == "director@iitm") {
          res.redirect("/cms/director-iitm");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  }
};

// Destroys the sessions and logs out the user
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    const previousPageUrl = req.headers.referer;
    res.redirect(previousPageUrl);
  });
};
