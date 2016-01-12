// controller of the index
var ahapdfApp = angular.module('ahapdfApp',['ngMaterial']);

ahapdfApp.controller('homeController', function ($scope, $interval)
{


	  var self = this,  j= 0, counter = 0;
	  self.mode = 'query';
      self.modes = [ ];
      self.activated = true;
      self.determinateValue = 30;
      // Iterate every 100ms, non-stop
      $interval(function() {
        // Increment the Determinate loader
        self.determinateValue += 1;
        if (self.determinateValue > 100) {
          self.determinateValue = 30;
        }
        if ( counter++ % 4 == 0 ) j++;
      }, 100, 0, true);


      $scope.checkbox = false;
      $("#btnDeleteNotes").hide();

      $scope.showCheckbox = function() {
        if($scope.checkbox == false){
          $("#btnDeleteNotes").show();
        }
        else{
          $("#btnDeleteNotes").hide();
        }
      }


      $scope.sprintcheckbox = false;
      $("#sprintbtnDeleteNotes").hide();

      $scope.sprintshowCheckbox = function() {
        if($scope.sprintcheckbox == false){
          $("#sprintbtnDeleteNotes").show();
        }
        else{
          $("#sprintbtnDeleteNotes").hide();
        }
      }

      

}); // end controller     