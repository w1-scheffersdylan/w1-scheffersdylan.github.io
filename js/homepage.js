$("#step1Container").fadeIn();

// button to switch between WEB and NOW story number
$('#changeStoryNumberNOW').click(function () {
  $('#changeStoryNumberNOW').css("display","none");
  $('#storyNumber').val('NOW-');
  $('#changeStoryNumberWEB').css("display","inline");
});
$('#changeStoryNumberWEB').click(function () {
  $('#changeStoryNumberWEB').css("display","none");
  $('#storyNumber').val('WEB-');
  $('#changeStoryNumberNOW').css("display","inline");
});

// button to switch between WEB and NOW sprint number
$('#changeStoryNumberNOWsprint').click(function () {
  $('#changeStoryNumberNOWsprint').css("display","none");
  $('#sprintNumber').val('NOW-R-');
  $('#changeStoryNumberWEBsprint').css("display","inline");
});
$('#changeStoryNumberWEBsprint').click(function () {
  $('#changeStoryNumberWEBsprint').css("display","none");
  $('#sprintNumber').val('WEB-R-');
  $('#changeStoryNumberNOWsprint').css("display","inline");
});