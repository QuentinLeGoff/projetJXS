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

webikeControllers.controller('HomeController', ['$scope', '$http', 'BatteryLevelPolling',
  function ($scope, $http, BatteryLevelPolling) {
    // Widget batterie
    $scope.autonomy = "80 mins";
    BatteryLevelPolling.startPolling();


  }]);

webikeControllers.controller('PerformancesController', ['$scope', '$http',
  function ($scope, $http) {
   
  }]);

/* ----------------------------------- FACTORY/SERVICES ----------------------------------- */

// BatteryLevelPolling : Récupère le niveau de la batterie toutes les x secondes
webikeApp.factory('BatteryLevelPolling', [function(){
  var pollingTime = 3000;
  var polls = {};
  var calls = 0;

  return {
      startPolling: function() {                
          var poller = function() {
            var level = Math.floor((Math.random() * 100)); // TODO
            if(calls == 0) initBatteryLevel(level);
            updateBatteryLevel(level);
            calls++;
          }
          poller();
          polls = setInterval(poller, pollingTime);
      },

      stopPolling: function() {
          clearInterval(polls);
          delete polls;
          calls = 0;
      }
  }
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