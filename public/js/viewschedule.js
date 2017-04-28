$(document).ready(function () {
  $('.deletable').click(function() {
    console.log('clicked on an event to delete it');
    var id = event.target.id;
    var owner = $('#' + id).data('owner');
    var schedule = $('#' + id).data('schedule');
    var name = $('#' + id).data('name');

    console.log(owner);
    console.log(name);

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
        },
        success: function (data) {
          console.log('send success');
        }
      });
  });
});