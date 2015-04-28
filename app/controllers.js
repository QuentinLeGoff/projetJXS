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

webikeControllers.controller('HomeController', ['$scope', '$http', 'BatteryLevelPolling', 'batteryLevel', 'weatherService',
  function ($scope, $http, BatteryLevelPolling, batteryLevel, weatherService) {
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

    // Widget méteo
    $scope.dailyWeather = weatherService.getDailyWeather();


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

// WeatherService: Retourne la météo du jour et des 3 prochains jours
webikeApp.factory('weatherService', ['$http', function($http) {
    return { 
      getDailyWeather: function() {
        var dailyWeather = new Array();
        $http.jsonp('http://api.openweathermap.org/data/2.5/forecast/daily?q=Rennes,fr&units=metric&cnt=4&APPID=18774ccf7e1356bf143885e7b0855166&callback=JSON_CALLBACK').success(function(data) {
            if (data) {
                if (data.list) {
                    var today = moment();

                    data.list.forEach(function(value){
                      var weather = { date: "", temp: 0, temp_min: 0, temp_max: 0, wind: "", icon: "" }
                      var date = moment(value.dt*1000).locale("fr");

                      if ( today.startOf("day").isSame(date.startOf("day")) ){
                        weather.date = "Aujourd'hui";
                      } else {
                        weather.date = date.format('dddd');
                      }
                      weather.temp = value.temp.day;
                      weather.temp_min = value.temp.min;
                      weather.temp_max = value.temp.max;
                      weather.wind = value.speed;
                      weather.icon = "http://openweathermap.org/img/w/" + value.weather[0].icon + ".png";
                      dailyWeather.push(weather);
                    });
                }
            }
        });
        return dailyWeather;
      }
    };
  }]);

// Filter temp : permet de tronquer les valeurs des températures
webikeApp.filter('temp', function($filter) {
    return function(input, precision) {
        if (!precision) {
            precision = 0;
        }
        var numberFilter = $filter('number');
        return numberFilter(input, precision);
    };
});

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
