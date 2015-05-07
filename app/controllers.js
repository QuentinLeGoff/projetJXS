var webikeControllers = angular.module('webikeControllers', []);

/* ----------------------------------- CONTROLLERS ----------------------------------- */

webikeControllers.controller('LoginController', ['$scope', '$location', 'Auth',
	function ($scope, $location, Auth) {
	  	$scope.login = function(){
	  		Auth.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    Auth.SetCookie(response.userdata, $scope.password);
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

    // Widget distances parcoures
    $scope.totaleDistance = getTotaleDistance();

    var weekDist = getDistance("week");
    updateDistance("Week",weekDist);
    console.log("Distance semaine :"+weekDist);

    var monthDist = getDistance("month");
    updateDistance("Month",monthDist);
    console.log("Distance mois :"+monthDist);

    var yearDist = getDistance("year");
    updateDistance("Year",yearDist);
    console.log("Distance année :"+yearDist);


    // Widget méteo
    $scope.dailyWeather = weatherService.getDailyWeather();


  }]);

webikeControllers.controller('PerformancesController', ['$scope', '$http',
  function ($scope, $http) {
  }]);
  
webikeControllers.controller('ProfileController', ['$scope', '$http',
  function ($scope, $http) {
   $scope.user = {name: "monnom", firstname: "monprénom", email: "truc@mail.com"};
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

function updateDistance(period,value){
  var percent = (value * 100) / getTotaleDistance();
  var mult = getTotaleDistance()/100;
  $("#distance"+period).progressbar({
      value: 1,
      create: function() {
        $("#distance"+period).find(".ui-progressbar-value").animate({"width":percent+"%"},{
          duration: 4000,
          step: function(now){
             $("#distance"+period).parent().find(".progressAnimateValue").html((now * mult).toFixed(0) +"km");
          },
          easing: "linear"
        })
      }
    });
}
