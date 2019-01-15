var db = require("../models");

// --------------- passport chris
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");


module.exports = function (app) {
  // Load index page with all Document

  app.get("/", function (req, res) {
    db.Document.findAll({}).then(function (dbDocument) {
      console.log("Doc", dbDocument);
      res.render("index", {
        documents: dbDocument
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/search", function (req, res) {
    db.Document.findOne({ where: { id: req.params.id } }).then(function (dbDocument) {
      res.render("search", {
        documents: dbDocument
      });
    });
  });

  // Load add page (form: source, title, desc...)
  app.get("/add", function (req, res) {
    res.render("add");
  });


  //---------passport chris
  app.get("/signup", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    }
    res.render("signup");
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    }
    res.render("login");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/welcome", isAuthenticated, function (req, res) {
    res.render("index");
  });


};
