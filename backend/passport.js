var GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = function(passport, mongoose) {
  var User = mongoose.model("User", {
    google: {
      id: String,
      name: String
    },
    services: {
      /* All we need is usernames */
      soundcloud: String,
      spotify: String
    },
    playlists: Array
  });

  //passport (de)serialization
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  //passport google login handling
  passport.use(new GoogleStrategy({
    clientID: "660256018377-a89rjjmq5mor7t599r88p1tt6ghq8kcd.apps.googleusercontent.com",
    clientSecret: "vaGXVmtfmOzmxrqfwE4_4adO",
    callbackURL: "http://plylistr.wesjd.net:3000/auth/google/callback",
    passReqToCallback: true
  }, function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ "google.id": profile.id }, function(err, user) {
        if(err) return done(err);
        if(user) {
          user.google.name = profile.displayName;
          user.save(function(er) {
            return done(er, user);
          });
        } else {
          var newUser = new User();

          newUser.google.id = profile.id;
          newUser.google.name = profile.displayName;

          newUser.services.soundcloud = "unknown";
          newUser.services.spotify = "unknown";

          newUser.save(function(er) {
            if(er) throw er;
            return done(null, newUser);
          });
        }
      });
    });
  }));
}
