$(document).ready(function () {
  $('.deletable').click(function() {
    var id = event.target.id;
    var owner = $('#' + id).data('owner');
    var schedule = $('#' + id).data('schedule');
    var name = $('#' + id).data('name');
    $('#' + id).remove();
    $.ajax({
        type: 'POST',
        url: '/home',
        data: { 
          clicked: 'deleteevent',
          attr: '',
          owner: owner,
          schedulename: schedule,
          eventname: name
        }
      });
  });
});