//express
var express = require("express");
var app = express();

//mongoose
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/plylistr");

//passport
var session = require("express-session");
var bodyParser = require("body-parser");
var passport = require("passport");

var RedisStore = require("connect-redis")(session);
var redis = require("redis").createClient();

//configure passport
var cookieSecret = "PLYLISTR: writtn n SC @ de Ransdells";
app.use(require("cookie-parser")(cookieSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  store: new RedisStore({
    host: "localhost",
    port: 6397,
    db: 0,
    client: redis,
    ttl: 1800000 /* 30m */
  }),
  secret: cookieSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//local
var passportHandler = require("./passport")(passport, mongoose);
require("./routes")(express, app, passport);

//view engine
app.set("views", __dirname + "/../frontend");
app.set("view engine", "jade");

//static assets
app.use(express.static(__dirname + "/../frontend"));

//express server
app.listen(3000, function() {
  console.log("Started server on port 3000.");
});
