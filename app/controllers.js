var webikeControllers = angular.module('webikeControllers', []);
var distances;
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

webikeControllers.controller('HistoryController', ['$scope', '$http', 'uiGmapGoogleMapApi', 'ItinerairesAPI',
  function ($scope, $http, uiGmapGoogleMapApi, ItinerairesAPI) {
    

    / * handle response sucess getBatterie */
    
    var handleResponse = function (data, status){
      $scope.itineraries = data;
      $scope.itinerary = {};

      $scope.selectedIndex = -1; // Whatever the default selected index is, use -1 for no selection

      $scope.itinerarySelected = function ($index) {
        $scope.selectedIndex = $index;
        var tab_index = (data.length-1) - $index;

        $scope.itinerary = {
          date : data[tab_index].date.jour + "/" + data[tab_index].date.mois + "/" + data[tab_index].date.annee + " - " + data[tab_index].date.h + "h" + data[tab_index].date.m,
          depart: data[tab_index].depart.text, 
          arrivee: data[tab_index].arrivee.text, 
          vitesse_max: data[tab_index].vitesse_max, 
          vitesse_moy: data[tab_index].vitesse_moy, 
          calories: data[tab_index].calories, 
          alt_max: data[tab_index].altitude_max, 
          alt_min: data[tab_index].altitude_min
        };
        var dep_lat = data[tab_index].depart.lat;
        var dep_long = data[tab_index].depart.long;
        var arr_lat = data[tab_index].arrivee.lat;
        var arr_long = data[tab_index].arrivee.long;

        var cent_lat = (dep_lat + arr_lat)/2;
        var cent_long = (dep_long + arr_long)/2;


        $scope.map = { center: { latitude: cent_lat, longitude: cent_long }, zoom: 13 };
        $scope.markers = [{
          id: 0,
          coords: {
              latitude: dep_lat,
              longitude: dep_long
          },
          icon: "img/green-dot.png"
          }, {
          id: 1,
          coords: {
              latitude: arr_lat,
              longitude: arr_long
          },
          icon: "img/red-dot.png"
        }];

      };
    }

    
    ItinerairesAPI.getItineraires().success(handleResponse);
    


  }]);

webikeControllers.controller('HomeController', ['$scope', '$http', 'BatteryLevelPolling', 'batteryLevel', 'weatherService', 'BatterieAPI','ItinerairesAPI',
  function ($scope, $http, BatteryLevelPolling, batteryLevel, weatherService, BatterieAPI, ItinerairesAPI) {
   
    // start polling
    BatteryLevelPolling.startPolling();

    // updateBatteryLevel
    $scope.$watch(function(scope) { return batteryLevel.level; },
      function(newValue, oldValue) {
          updateBatteryLevel(newValue);
      }
    );

    $scope.$watch(function(scope) { return batteryLevel.autonomy; },
      function(newValue, oldValue) {
           $scope.autonomy = newValue + " km";
      }
    );

    // Widget All Time Record
    var dateLastRecharge;
    var maxDistance;
    var handleResponseBattery =  function (data, status){
      dateLastRecharge = {jour: data[0].lastRecharge.day , mois: data[0].lastRecharge.month, annee: data[0].lastRecharge.year }
      maxDistance = data[0].maxDistanceBetweenRecharge;

      ItinerairesAPI.getItineraires().success(handleResponseItineraires);

    }

    var handleResponseItineraires = function (data,status){
      distances = data;

      // Max speed
      $scope.maxSpeed = getMaxSpeed();

      // Max distance
      var distance = getDistanceSinceLastRecharge(dateLastRecharge);
      
      
      if(distance > maxDistance){
        $scope.maxDistance = distance.toFixed(1);
        BatterieAPI.updateDistanceMax(distance).success(function(){});
      }else{
        $scope.maxDistance = maxDistance.toFixed(1);
      }

      // Widget distances parcoures
      $scope.totaleDistance = getTotaleDistance().toFixed(1);

      var weekDist = getDistance("week");
      updateDistance("Week",weekDist);

      var monthDist = getDistance("month");
      updateDistance("Month",monthDist);

      var yearDist = getDistance("year");
      updateDistance("Year",yearDist);
    }

    BatterieAPI.getBatterie().success(handleResponseBattery);

    // Widget méteo
    $scope.dailyWeather = weatherService.getDailyWeather();


  }]);


// Performance controller
webikeControllers.controller('PerformancesController', ['$scope', '$http', 'ItinerairesAPI',
  function ($scope, $http, ItinerairesAPI) {

    function gd(date) {
        return new Date(date.annee, date.mois - 1, date.jour).getTime();
    }

    function contains(array,val){
      for (var i in array){
        if(array[i][0] == val) return i;
      }
      return -1;
    }

    var handleResponse =  function (data, status){
      
      // construit la série de données
      var tab = [];
      for(var i = 0; i < data.length; i++){
        var index = contains(tab,gd(data[i].date))
        if( index != -1 ){
          tab[index][1] += data[i].distance;
        }else{
          tab.push([gd(data[i].date),data[i].distance]);
        }
      }

      initChart(tab);
    }
    ItinerairesAPI.getItineraires().success(handleResponse);
  }]);
  

// Profile controller
webikeControllers.controller('ProfileController', ['$scope', '$http','$cookieStore',
  function ($scope, $http, $cookieStore) {

    var cookies = $cookieStore.get('globals') || {};
    if( cookies.currentUser ){
      var data = cookies.currentUser.userdata;
      $scope.user = {firstname: data.firstname, lastname: data.lastname, email: data.email, location: data.location};
    }

  }]);


// Console controller
webikeControllers.controller('ConsoleController', ['$scope', '$http', 'BatterieAPI',
  function ($scope, $http, BatterieAPI) {

    $scope.updateLevelBattery = function (level){
      if( !isNaN(level) && level >= 0 && level <= 100 ){
        BatterieAPI.updateLevelBatterie(level).success(function(){}); //API CALL
      }
    }

    $scope.updateDistanceMax = function (dist){
      if( !isNaN(dist) && dist >= 0){
        console.log("distancemax :" + dist);
        BatterieAPI.updateDistanceMax(dist).success(function(){}); //API CALL
      }
    }

  }]);

/* ----------------------------------- FACTORY/SERVICES ----------------------------------- */
// BatteryLevel
webikeApp.factory('batteryLevel',function () {
  return { level : 50, autonomy: 0};
});

// BatteryLevelPolling : Récupère le niveau de la batterie toutes les x secondes
webikeApp.factory('BatteryLevelPolling', ['batteryLevel', '$interval', 'BatterieAPI',  function (batteryLevel, $interval, BatterieAPI){
  var pollingTime = 3500;
  var polls = {};
  var calls = 0;

  /* handle response sucess getBatterie */
  var handleResponse = function (data, status){
      var level =  data[0].level;
      batteryLevel.level = level;
      batteryLevel.autonomy = (60 * level)/100;  
      if(calls == 0) initBatteryLevel(level);
      calls++;
  }

  return {
      startPolling: function() {                
          var poller = function() {
            BatterieAPI.getBatterie().success(handleResponse); // API CALL
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

webikeApp.filter('monthName', [function() {
    return function (monthNumber) { //1 = January
        var monthNames = [ 'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ];
        return monthNames[monthNumber - 1];
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

function updateDistance(period,value){
  var percent = (value * 100) / getTotaleDistance();
  var mult = getTotaleDistance()/100;
  $("#distance"+period).progressbar({
      value: 0.1,
      create: function() {
        $("#distance"+period).find(".ui-progressbar-value").animate({"width":percent+"%"},{
          duration: 4000,
          step: function(now){
             $("#distance"+period).parent().find(".progressAnimateValue").html((now * mult).toFixed(1) +"km");
          },
          easing: "linear"
        })
      }
    });
}

function initChart ( value ) {
  if($("#graph_perf").length){
  
    var stack = 0, bars = false, lines = true, steps = false;

    function plotWithOptions() {
      $.plot($("#graph_perf"), [ value ], {
        xaxis: {
          mode: "time",
          timeformat: "%d/%m"
        },
        series: {
            label: "km parcourus",
             lines: { show: true, lineWidth: 2},
             points: { show: true },
             shadowSize: 2
        },
        grid: { hoverable: true, 
               clickable: true, 
               tickColor: "#dddddd",
               borderWidth: 0 
        },
        colors: ["#FA5833"]
      });
    }

    plotWithOptions();

    $("#graph_perf").bind("plothover", function (event, pos, item) {
      if ( item ){
        var km = item.datapoint[1];
        var date = moment(item.datapoint[0]).locale("fr");

        $("#hoverdata").html("<b>&nbsp; &nbsp;" + km +  " km le " + date.format('DD MMMM YYYY')+"</b>");
      } else {
        $("#hoverdata").html("<br/>");
      }
    });

  }
}