var webikeApp = angular.module('webikeApp', [
  'ngRoute',
  'ngCookies',
  'webikeControllers',
  'uiGmapgoogle-maps'
  ]);

webikeApp.config(['$routeProvider','$locationProvider','$httpProvider',
  function ($routeProvider,$locationProvider,$httpProvider) {

    //$locationProvider.html5Mode(true);        
    $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = "*";
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider
    .when('/', {
      title: "Dashboard | WeBike",
      templateUrl: 'template/home.html',
      controller: 'HomeController'
    })
    .when('/login', {
      title: "Connexion | WeBike",
      templateUrl: 'template/login.html',
      controller: 'LoginController'
    })
    .when('/history', {
      title: "Mon historique | WeBike",
      templateUrl: 'template/history.html',
      controller: 'HistoryController'
    })
    .when('/performances', {
      title: "Mes performances | WeBike",
      templateUrl: 'template/performances.html',
      controller: 'PerformancesController'
    })
    .when('/profile', {
      title: "Mon profil | WeBike",
      templateUrl: 'template/profile.html',
      controller: 'ProfileController'
    })
    .when('/console', {
      title: "Console | WeBike",
      templateUrl: 'template/console.html',
      controller: 'ConsoleController'
    })
    .otherwise({
      redirectTo: '/'
    });

  }]);


// Main controller
webikeApp.controller('webikeController', ['$scope', '$http', '$location', 'Auth', 'batteryLevel', '$cookieStore',
  function ($scope, $http, $location, Auth, batteryLevel, $cookieStore) {
    var first_notif = true;

    // set firstname & lastname
    var cookies = $cookieStore.get('globals') || {};
    if( cookies.currentUser ){
      $scope.user = {firstName: cookies.currentUser.userdata.firstname, lastName: cookies.currentUser.userdata.lastname};
    }

    $scope.notifications = [];
    $scope.notification_message = "Pas de notifications";
    $scope.notification_count = 0;

    // Appel de ActivateFunctions() qui active les animations et les fonctions des composants
    $scope.$on('$viewContentLoaded', function () {
      activateFunctions();
    });

    // Ajout de la class 'active' sur les items de la sidebar
    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };

    $scope.loggedIn = function (){
      return Auth.IsLoggedIn();
    }

    // Logout
    $scope.logout = function (){
      Auth.RemoveCookie();
      $location.path('/login');
    };

    $scope.$watch(function(scope) { return batteryLevel.level; },
      function(newValue, oldValue) {
          notifications(newValue);
      },true
    );


    // manage notifications
    function majNotificationText(){
      var count = $scope.notification_count;
      if(count == 0){
        $scope.notification_message = "Pas de notifications";
      } else if(count == 1) {
        $scope.notification_message = $scope.notification_count + " notification";     
      } else {
        $scope.notification_message = $scope.notification_count + " notifications";     
      }
    };

    // supprimme notification
    $scope.removeNotification = function(notif) {
      var index = $scope.notifications.indexOf(notif);
      $scope.notifications.splice(index, 1);
      $scope.notification_count--;
      majNotificationText();
    };

    // si batterie < 10% -> notif 
    // si batterie = 100% -> notif
    function notifications(val){
      if(val <= 10 && first_notif) {
        first_notif = false;
        var date = new Date();
        var date_text = date.getHours() + "h" + (date.getMinutes()<10 ? '0':'') + date.getMinutes();
        $scope.notifications.push({type: "alert", message:"Batterie presque déchargée !", date: date_text});
        $scope.notification_count++;
        majNotificationText();
      }else if( val > 10 && val < 100){
        first_notif = true;
      }else if(val == 100){
        var date = new Date();
        var date_text = date.getHours() + "h" + (date.getMinutes()<10 ? '0':'') + date.getMinutes();
        $scope.notifications.push({type: "info", message:"La batterie est chargée !", date: date_text});
        $scope.notification_count++;
        majNotificationText();
      }
    };

  }]);

/* ----------------------------------- RUN ----------------------------------- */

webikeApp.run(['$location', '$rootScope', '$cookieStore', '$http', 'BatteryLevelPolling', function ($location, $rootScope, $cookieStore, $http, BatteryLevelPolling) {

    // Redirection vers /login si pas connecté
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      $rootScope.globals = $cookieStore.get('globals') || {};
      if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
      }

      // Si connecté et location == login page -> redirige vers /
      if ($rootScope.globals.currentUser &&  $location.path() == "/login"){
        $location.path('/');
      }

      // Si non-connecté -> redirige vers /login
      if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
        $location.path('/login');
      }
    });

    // Mise à jour du titre de la page en fonction de la route
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
      $rootScope.title = current.$$route.title;
      // Stop polling BatteryLevel
      BatteryLevelPolling.stopPolling();
    });

  }]);


// Service d'authentification
webikeApp.factory('Auth', ['$http', '$cookieStore', '$rootScope', 'UserAPI',
  function ($http, $cookieStore, $rootScope, UserAPI){
    var service = {};

    // Authentification via l'API
    service.Login = function (username, password, callback){
      
      var handleResponse = function (data, status){
        var response = {};

        if( data == null || data.username != username) {
          response = {success: false, message: "Nom d'utilisateur incorect"};
        }else if( password != data.password){
          response = {success: false, message: "Mot de passe incorect"};
        }else{
          response = {success: true, userdata: data};
          $rootScope.user = {firstName : data.firstname, lastName : data.lastname};

        }

        callback(response);
      };

      //API CALL
      UserAPI.getUser(username).success(handleResponse);

    };

    // Crée un cookie globals
    service.SetCookie = function (userdata, password){
      var authdata = window.btoa(password);
      $rootScope.globals = {
        currentUser: {
          userdata: userdata,
          authdata: authdata
        }
      };
      $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
      $cookieStore.put('globals', $rootScope.globals);
    };

    // Remove cookie globals
    service.RemoveCookie = function (){
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = 'Basic ';
    };

    // Check si l'utilisateur est connecté
    service.IsLoggedIn = function (){
      var glob = $cookieStore.get('globals') || {};
      return !angular.isUndefined(glob.currentUser);
    };

    return service;
  }]);
  
/* ----------------------------------- API ----------------------------------- */
  var IP_SERVER = "http://148.60.11.177:3000/";

  webikeApp.factory('UserAPI', ['$http', function ($http){
    return {
        getUser: function (username){
          return $http.get(IP_SERVER + "users/" + username);
        }
    };
  }]);

  webikeApp.factory('BatterieAPI', ['$http', function ($http){
    return {
        getBatterie: function (){
          return $http.get(IP_SERVER + "batterie");
        },
        updateLevelBatterie: function (value){
          return $http.put(IP_SERVER + "batterie/update_level/" + value);
        },
        updateDistanceMax: function (value){
          return $http.put(IP_SERVER + "batterie/update_distancemax/" + value);
        }
    };
  }]);