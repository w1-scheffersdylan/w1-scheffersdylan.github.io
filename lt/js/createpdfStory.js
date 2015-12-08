$("#controls").submit(function() {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.leantesting.com", false);
  xhr.send();

  console.log(xhr.status);
  console.log(xhr.statusText);
  
  return false;
  
});

