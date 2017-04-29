$(document).ready(function() {
  var $loginButton = $('#loginButton');
  $loginButton.click(function() {
    var username = $('#loginBox').val();
    var password = $('#passwordBox').val();
  });

  var $registerButton = $('#registerButton');
  $registerButton.click(function() {
  	var newUsername = $('#loginBox').val();
  	var newPassword = $('#passwordBox').val();
  });
});

