$(document).ready(function () {
  $('#timeOfCreationOrder').click(function () {
    console.log('timeOfCreationOrder');
    $.ajax({
        type: 'POST',
        url: '/displayops',
        data: { 
          clicked: 1,
        },
        success: function (data) {
          window.location.href='/home';
        }
      });
  });

  $('#dateOrder').click(function () {
    console.log('dateOrder');
    $.ajax({
        type: 'POST',
        url: '/displayops',
        data: { 
          clicked: 2,
        },
        success: function (data) {
          window.location.href='/home';
        }
      });
  });

  $('#priorityOrder').click(function () {
    console.log('priorityOrder');
    $.ajax({
        type: 'POST',
        url: '/displayops',
        data: { 
          clicked: 3,
        },
        success: function (data) {
          window.location.href='/home';
        }
      });
  });

  $('#alphaOrder').click(function () {
    console.log('alphaOrder');
    $.ajax({
        type: 'POST',
        url: '/displayops',
        data: { 
          clicked: 4,
        },
        success: function (data) {
          window.location.href='/home';
        }
      });
  });
});