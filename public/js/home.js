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
	$('#homeScheduleOpen').click(function() {
		var input = $('#homeScheduleInput').val();
		
		$.ajax({
	      type: 'POST',
	      url: '/home',
	      data: { 
	        clicked: 'openschedule',
	        attr: input,
	        attr2: ''
	      }
	    });
	    window.location.href = '/viewschedule';
	});
	//----------------------------------------------------
	$('#homeSharedOpen').click(function() {
		var input = $('#homeSharedInput').val();
		var spec = $('#homeSharedOwner').val();

		$.ajax({
	      type: 'POST',
	      url: '/home',
	      data: { 
	        clicked: 'openshared',
	        attr: input,
	        attr2: spec
	      }
	    });
	    window.location.href = '/viewschedule';
	});
});