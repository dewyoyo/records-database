var db = require("../models");
// const express = require('express');
const bodyParser = require('body-parser');
// const app = express ();
const AWS = require('aws-sdk');
const fileUpload = require('express-fileupload');


// --------------- passport chris
var passport = require("../config/passport");


AWS.config.credentials = {
  accessKeyId: process.env.IDKEY,
  secretAccessKey: process.env.SECRETKEY,
  region: process.env.REGION
};

var s3Bucket = new AWS.S3({params: {Bucket: "goldpony"}});
const baseAWSURL = "https://s3-us-west-1.amazonaws.com/goldpony/";

module.exports = function(app) {

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({extended:true}));
// New Middleware!
app.use(fileUpload());
// app.set('view engine', 'ejs');

  
  // Get all Document
  app.get("/api/Document", function(req, res) {
    db.Document.findAll({}).then(function(dbDocument) {
      console.log(dbDocument,"Records fetched");
      res.json(dbDocument);
    });
  });


  app.post('/users', function(req, res) {
    console.log("req.body IS: " + JSON.stringify(req.body));
    console.log("req.files.upload IS: " + JSON.stringify(req.files.upload));
    let uploadData = {
      Key: Date.now() + req.files.upload.name,
      Body: req.files.upload.data,
      ContentType: req.files.upload.mimetype,  
      ACL: 'public-read'
    }
    s3Bucket.putObject(uploadData, function(err, data){
      if(err){
        console.log(err);
        return;
      }
      console.log ("For Sequelize req.files: " + req.files.upload)
      db.Document.create({
        source: req.body.source,
        document_name: req.body.title,
        docdate: req.body.docdate,
        category: req.body.category.toString(),
        description: req.body.description,
        image: baseAWSURL + uploadData.Key // We know that they key will be the end of the url

      }).then(()=>{
        // res.redirect('/api/Document');
        res.redirect('/');
      })
    });
  });

// --------------- passport chris
// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/signup', function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function(result) {
      res.redirect(307, "/api/login");
      // console.log(result);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/");
    // res.json(res);
  });

// Route for getting some data about our user to be used client side
app.get("/api/user_data", function(req, res) {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  }
  else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  }
});

// Route for logging user out
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});


}
  


// // Add Document to database
//   app.post("/api/Document", function(req, res) {
//     console.log(req.body);
//     db.Document.create({
//       source: req.body.source,
//       document_name: req.body.title,
//       docdate: req.body.date,
//       category: req.body.category,
//       description: req.body.description
//     })
//       .then(function(dbPost) {
//         res.redirect('/api/Document');
//       });
//   });

  
//   // Delete a document by id
//   app.delete("/api/Document/:id", function(req, res) {
//     db.Document.destroy({ where: { id: req.params.id } }).then(function(dbDocument) {
//       res.json(dbDocument);
//     });
//   });
// };
