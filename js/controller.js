// controller of the index
var ahapdfApp = angular.module('ahapdfApp',['ngMaterial']);

ahapdfApp.controller('homeController', function ($scope)
{
	this.userState = '';
	this.states = ('WEB INSPECT').split(' ').map(function (state) { return { abbrev: state }; });
}); // end controller     