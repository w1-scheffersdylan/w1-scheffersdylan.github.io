// controller of the index
var ahapdfApp = angular.module('ahapdfApp',['ngMaterial']);

ahapdfApp.controller('homeController', function ($scope, $http)
{
	$http.get("https://leantesting.com/login/oauth/authorize", {

		params: {
			//"parameter" : "value",
			'client_id' : 'Jvu68zct2aG1Xx4bEefGibq33izoUdsenIW6fO29',
			'redirect_uri' : 'https://w1-scheffersdylan.github.io/lt/'
		}
	}).then(function(response){

		console.log(response);

	})
}); // end controller     