$(document).ready(function() {
  var $loginButton = $('#loginButton');
  $loginButton.click(function() {
    console.log('clicked the login button');
    var username = $('#loginBox').val();
    var password = $('#passwordBox').val();
    console.log(username + ', ' + password);
    //TODO store somewhere??
  });

  var $registerButton = $('#registerButton');
  $registerButton.click(function() {
  	console.log('clicked the register button');
  	var newUsername = $('#loginBox').val();
  	var newPassword = $('#passwordBox').val();
  	console.log(newUsername + ', ' + newPassword);
  	//TODO store somewhere?
  });
});

