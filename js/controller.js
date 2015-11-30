// controller of the index
var ahapdfApp = angular.module('ahapdfApp',['ngMaterial']);

ahapdfApp.controller('homeController', function ($scope)
{
	$scope.productKeys = [

		{"name": "WEB"},
		{"name": "INSPECT"}

	];
}); // end controller     