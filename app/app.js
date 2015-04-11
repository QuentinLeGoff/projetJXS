var webikeApp = angular.module('webikeApp', [
  'ngRoute',
  'webikeControllers'
]);

webikeApp.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
    
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

// Mise à jour du titre de la page en fonction de la route
webikeApp.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);