var webikeControllers = angular.module('webikeControllers', []);

/* ----------------------------------- CONTROLLERS ----------------------------------- */

webikeControllers.controller('LoginController', ['$scope', '$location', 'Auth',
	function ($scope, $location, Auth) {
	  	$scope.login = function(){
	  		Auth.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    Auth.SetCookie($scope.username, $scope.password);
                    $location.path("/");
                } else {
                    $scope.error = response.message;
                }
	        });
  		};
  }]);

webikeControllers.controller('HistoryController', ['$scope', '$http',
  function ($scope, $http) {
   
  }]);

webikeControllers.controller('HomeController', ['$scope', '$http', 'BatteryLevelPolling', 'batteryLevel',
  function ($scope, $http, BatteryLevelPolling, batteryLevel) {
    // Widget batterie
    $scope.autonomy = "80 min";
    
    // start polling
    BatteryLevelPolling.startPolling();

    // updateBatteryLevel
    $scope.$watch(function(scope) { return batteryLevel.level; },
      function(newValue, oldValue) {
          updateBatteryLevel(newValue);
      }
    );

  }]);

webikeControllers.controller('PerformancesController', ['$scope', '$http',
  function ($scope, $http) {
   
  }]);

/* ----------------------------------- FACTORY/SERVICES ----------------------------------- */
// BatteryLevel
webikeApp.factory('batteryLevel',function () {
  return { level : 50 };
});

// BatteryLevelPolling : Récupère le niveau de la batterie toutes les x secondes
webikeApp.factory('BatteryLevelPolling', ['batteryLevel', '$interval', function(batteryLevel,$interval){
  var pollingTime = 3000;
  var polls = {};
  var calls = 0;

  return {
      startPolling: function() {                
          var poller = function() {
            var level = Math.floor((Math.random() * 100)); // TODO
            if(calls == 0) initBatteryLevel(level);
            batteryLevel.level = level;
            calls++;
          }
          poller();
          polls = $interval(poller, pollingTime);
      },

      stopPolling: function() {
          clearInterval(polls);
          delete polls;
          calls = 0;
      }
  };
}]);

/* ----------------------------------- FUNCTIONS ----------------------------------- */

function initBatteryLevel (value){
  $("#battery").val(value);
  $("#battery").knob({
    'min':0,
    'max':100,
    'readOnly': true,
    'width': 120,
    'height': 120,
    'bgColor': 'rgba(255,255,255,0.5)',
    'fgColor': 'rgba(255,255,255,0.9)',
    'thickness': 0.2,
    'tickColorizeValues': true
  });
};

function updateBatteryLevel (value){
  var oldValue = $("#battery").val();
  $({value: oldValue}).animate({value: value}, {
    duration: 1000,
    easing:'swing',
    step: function() 
    {
        $('#battery').val(Math.round(this.value)).trigger('change');
    }
  });
};