var webikeApp = angular.module('webikeApp', [
  'ngRoute',
  'ngCookies',
  'webikeControllers'
  ]);

webikeApp.config(['$routeProvider','$locationProvider',
  function ($routeProvider,$locationProvider) {

    //$locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
      title: "Dashboard | WeBike",
      templateUrl: 'template/home.html'
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
    .otherwise({
      redirectTo: '/'
    });

  }]);


// Main controller
webikeApp.controller('webikeController', ['$scope', '$http', '$location', 'Auth',
  function ($scope, $http, $location, Auth) {
    $scope.user = {firstName : "Soren", lastName : "Bjerg"};

    // Appel de ActivateFunctions() qui active les animations et les fonctions des composants
    $scope.$on('$viewContentLoaded', function () {
      activateFunctions();
    });

    // Ajout de la class 'active' sur les items de la sidebar
    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };

    // Logout
    $scope.logout = function (){
      Auth.RemoveCookie();
      window.location = "/app/login.html"; // redirect
    };

  }]);

webikeApp.run(['$location', '$rootScope', '$cookieStore', '$http', function ($location, $rootScope, $cookieStore, $http) {

    // Redirection sur /login.html si pas connecté
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      $rootScope.globals = $cookieStore.get('globals') || {};
      if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
      }

      // Si connecté et location == login page -> redirige vers Home
      if ($rootScope.globals.currentUser &&  window.location.pathname == '/app/login.html'){
        window.location = "/app";
      }

      // Si non-connecté -> redirige vers page Login
      if (!$rootScope.globals.currentUser) {
        window.location = "/app/login.html";
      }
    });

    // Mise à jour du titre de la page en fonction de la route
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
      $rootScope.title = current.$$route.title;
    });

  }]);


// Service d'authentification
webikeApp.factory('Auth', ['$http', '$cookieStore', '$rootScope', 
  function ($http, $cookieStore, $rootScope){
    var service = {};

    // Authentification via l'API
    service.Login = function (username, password, callback){
      var response = {};

      /* TODO */
      if(username === "test" && password === "test"){
        response = {success : true};
      }else{
        response = {success : false, message : "Nom d'utilisateur / mot de passe incorect"};
      }

      callback(response);
    };

    // Crée un cookie globals
    service.SetCookie = function (username, password){
      var authdata = window.btoa(password);
      $rootScope.globals = {
        currentUser: {
          username: username,
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

    return service;
  }]);