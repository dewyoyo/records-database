$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function (data) {
    // $(".member-name").text(data.email);


    if (data.email) {
      var newHref = "<div class='navbar-header'> "
        + "Logged as &lt;" + data.email + "&gt;"
        + " <a class='navbar-brand' id='data-welcome' href='/logout'>Logout</a> "
        + "</div>";
      $("#header").append(newHref);
    }
    else {
      var newHref = "<div class='navbar-header'> "
      + " <a class='navbar-brand' id='data-welcome' href='/login'>Login</a> "
      + "</div>";
    $("#header").append(newHref);
    }

  });



});
