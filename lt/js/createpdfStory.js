$("#controls").submit(function() {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://leantesting.com/login/oauth/authorize/Jvu68zct2aG1Xx4bEefGibq33izoUdsenIW6fO29", false);
  xhr.send();

  console.log(xhr.status);
  console.log(xhr.statusText);

  return false;
  
});

