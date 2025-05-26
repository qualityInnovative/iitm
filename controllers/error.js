const pageTitle = "Page Not Found!";

exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle,
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};
