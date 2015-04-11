var webikeApp = angular.module('webikeApp', [
  'ngRoute',
  'webikeControllers'
]);

webikeApp.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
    
    //$locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
      templateUrl: 'template/home.html'
      })
    .when('/history', {
        templateUrl: 'template/history.html',
        controller: 'HistoryController'
      })
    .when('/performances', {
        templateUrl: 'template/performances.html',
        controller: 'PerformancesController'
      })
    .otherwise({
        redirectTo: '/'
      });

  }]);


// Main controller
webikeApp.controller('webikeController', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {
    $scope.user = {firstName : "Soren", lastName : "Bjerg"};

   // Appel de ActivateFunctions() qui active les animations et les fonctions des composants
   $scope.$on('$viewContentLoaded', function() {
    activateFunctions();
    });

   // Ajout de la class 'active' sur les items de la sidebar
   $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };


  }]);