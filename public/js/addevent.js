$(document).ready(function() {

	$('#eventSubmit').click(function() {
    console.log('clicked add event button');
		var schedule = $('#eventSchedule').val();
		var name = $('#eventName').val();
		var date = $('#eventDate').val();
		var priority = $('#eventPriority').val();
		var info = $('#eventInfo').val();

		$.ajax({
	      type: 'POST',
	      url: '/addevent',
	      data: { 
	        clicked: 'newEvent',
          owner: '',
	        schedule: schedule,
	        eventName: name,
	        eventDate: date,
	        eventPriority: priority,
	        eventInfo: info
	      },
        success: function (data) {
          window.location.href='/viewschedule';
        }
      });
	 });   


  $('#sharedSubmit').click(function() {
    var id = $('#sharedSchedule').val();
    var schedule = $('#' + id).data('schedulename');
    var owner = $('#' + id).data('owner');
    var name = $('#sharedName').val();
    var date = $('#sharedDate').val();
    var priority = $('#sharedPriority').val();
    var info = $('#sharedInfo').val();


    $.ajax({
        type: 'POST',
        url: '/addevent',
        data: { 
          clicked: 'sharedEvent',
          owner: owner,
          schedule: schedule,
          eventName: name,
          eventDate: date,
          eventPriority: priority,
          eventInfo: info
        },
        success: function (data) {
          window.location.href='/viewschedule';
        }
      });
   }); 

});	
	
