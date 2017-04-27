$(document).ready(function() {
	$('#eventSubmit').click(function() {
		var schedule = $('#eventSchedule').val();
		var name = $('#eventName').val();
		var date = $('#eventDate').val();
		var priority = $('#eventPriority').val();
		var info = $('#eventInfo').val();

		console.log(schedule);
		console.log(name);
		console.log(date);
		console.log(priority);
		console.log(info);

		$.ajax({
	      type: 'POST',
	      url: '/addevent',
	      data: { 
	        clicked: 'newEvent',
	        schedule: schedule,
	        eventName: name,
	        eventDate: date,
	        eventPriority: priority,
	        eventInfo: info
	      }
	    });
	    window.location.href='/home';
	});	
	
});