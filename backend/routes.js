module.exports = function(express, app, passport) {
  var main = express.Router();
  var googleAuth = express.Router();

  main.get("/main", function(req, res) {
    res.render("index");
  });
  main.get("/login", function(req, res) {
    res.render("login");
  });
  main.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/main");
  });
  main.get("/profile", checkLogin, function(req, res) {
    res.send("yay");
  });

  googleAuth.get("/", passport.authenticate("google", { scope: "profile" }), function(req, res) {});
  googleAuth.get("/callback", passport.authenticate("google", { failureRedirect: "/login" }), function(req, res) {
    res.redirect("/profile");
  });

  app.use("/auth/google", googleAuth);
  app.use(main);
}

function checkLogin(req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}
