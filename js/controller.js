// controller of the index
var ahapdfApp = angular.module('ahapdfApp',['ngMaterial']);

ahapdfApp.controller('homeController', function ($scope, $interval)
{



      var self = this,  j= 0, counter = 0;
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
        // Incrementally start animation the five (5) Indeterminate,
        // themed progress circular bars
        if ( (j < 5) && !self.modes[j] && self.activated ) {
          self.modes[j] = 'indeterminate';
        }
        if ( counter++ % 4 == 0 ) j++;
      }, 100, 0, true);
    
}); // end controller     