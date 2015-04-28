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

    // Widget All Time Record
    $scope.maxSpeed = getMaxSpeed();

    var distance = getDistanceSinceLastRecharge();
    var maxDistance = getMaxDistanceBetweenTwoRecharge();
    if(distance > maxDistance){
      $scope.maxDistance = distance.toFixed(1);
      updateMaxDistanceBetweenTwoRecharge(distance);
    }else{
      $scope.maxDistance = maxDistance.toFixed(1);
    }

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

function getMaxSpeed(){
  var speed = distances[0].vitesse_max;
  for(var i=1; i<distances.length;i++){
    if(distances[i].vitesse_max > speed) speed = distances[i].vitesse_max;
  }
  return speed;
}

function getDistanceSinceLastRecharge(){
  var distance = 0;

  // Last Date recharge (request bdd)
  var lastDate = new Date(lastDateRecharge.annee,lastDateRecharge.mois,lastDateRecharge.jour);


  for(var i=0; i<distances.length;i++){
    var currentDate = new Date(distances[i].date.annee,distances[i].date.mois,distances[i].date.jour);
    if(currentDate > lastDate) distance += distances[i].distance;
  }
  return distance;
}

function updateMaxDistanceBetweenTwoRecharge(distance){
  // update bdd
}

function getMaxDistanceBetweenTwoRecharge(){
  // request bdd
  return maxDistanceBetweenTwoRecharge;
}
