$(document).ready(function() {
	$('#homeScheduleAdd').click(function() {
		var input = $('#homeScheduleInput').val();

		$.ajax({
	      type: 'POST',
	      url: '/home',
	      data: { 
	        clicked: 'addschedule',
	        attr: input
	      }
	    });
	});
	//----------------------------------------------------
	$('#homeScheduleDelete').click(function() {
		var input = $('#homeScheduleInput').val();

		$.ajax({
	      type: 'POST',
	      url: '/home',
	      data: { 
	        clicked: 'deleteschedule',
	        attr: input
	      }
	    });
	});
	//----------------------------------------------------
	$('#homeFriendAdd').click(function() {
		var input = $('#homeFriendInput').val();

		$.ajax({
	      type: 'POST',
	      url: '/home',
	      data: { 
	        clicked: 'addfriend',
	        attr: input
	      }
	    });
	});
	//----------------------------------------------------
	$('#homeFriendDelete').click(function() {
		var input = $('#homeFriendInput').val();

		$.ajax({
	      type: 'POST',
	      url: '/home',
	      data: { 
	        clicked: 'deletefriend',
	        attr: input
	      }
	    });
	});
	//----------------------------------------------------
	$('.scheduleClickable').click(function() {
		console.log(event.target.id);
	});
});