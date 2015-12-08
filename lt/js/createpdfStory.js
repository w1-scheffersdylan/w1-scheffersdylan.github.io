$("#controls").submit(function() {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://leantesting.com/login/oauth/authorize", false);
  xhr.send();

  console.log(xhr.status);
  console.log(xhr.statusText);
  
  return false;
  
});

