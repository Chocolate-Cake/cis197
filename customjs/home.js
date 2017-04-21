$(document).ready(function() {

  //ADD NEW EVENT DIV------------------------------
  
  //TODO send all makenewevent function
  //TODO make sure date input is valid due to feb
  //and leap years being inconvenient
  //TODO require today's date for calculations of 
  //display order, maybe different file though
  var $eventName = $('#eventName');
  var $eventDay = $('#eventDay');
  var $eventMonth = $('#eventMonth');
  var $eventYear = $('#eventYear');
  var $eventPriority = $('#eventPriority');
  var $eventInfo = $('#eventInfo');

  var $submitEventButton = $('#submitEventButton');
  $submitEventButton.click(function() {
    
    console.log('clicked the submit event button');
    console.log('name of event is ' + $eventName.val());
    console.log('date of event is ' + $eventDay.val() + '/' +
    $eventMonth.val() + '/' + $eventYear.val());
    console.log('priority of event is ' + $eventPriority.val());
    console.log('other info about event: ' + $eventInfo.val());
  });

  $eventPriority.click(function() {
    console.log('clicked drop down of event priority');
  });
  //display hidden div if priority is critical
  $eventPriority.change(function () {
    var value = $(this).val();
    console.log($(this).val());
    if (value === 'critical') {
      $('#critEmailDate').css('display', 'block');
    } else {
      $('#critEmailDate').css('display', 'none');
    }
  });

  //MY CALENDARS DIV------------------------------



  //SCHEDULE OPTIONS DIV--------------------------
  
  //TODO get display working first before getting fancy
  var $displayByDateButton = $('#displayByDateButton');
  $displayByDateButton.click(function () {
    console.log('clicked the display by date button');
  });

  var $displayByPriorityButton = $('#displayByPriorityButton');
  $displayByPriorityButton.click(function () {
    console.log('clicked on the display by priority button');
  });


  //OTHER OPTIONS DIV-----------------------------
  //TODO make a new schedule and put it in the main box
  var $makeNewScheduleButton = $('#makeNewScheduleButton');
  $makeNewScheduleButton.click(function() {
    console.log('clicked the make new schedule button');
  });

  //TODO go to a new page to change the password 
  //by asking for old password
  var $changePasswordButton = $('#changePasswordButton');
  $changePasswordButton.click(function() {
    console.log('clicked the change password button');
  });

  //TODO go to a new page to add usernames to calendar so these
  //people can also access/edit the calendar
  var $shareScheduleButton = $('#shareScheduleButton');
  $shareScheduleButton.click(function() {
    console.log('clicked share schedule');
  });

});