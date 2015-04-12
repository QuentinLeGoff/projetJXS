var webikeControllers = angular.module('webikeControllers', []);

webikeControllers.controller('LoginController', ['$scope', '$location', 'Auth',
	function ($scope, $location, Auth) {
	  	$scope.login = function(){
	  		Auth.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    Auth.SetCookie($scope.username, $scope.password);
                    window.location = "/app";
                } else {
                    $scope.error = response.message;
                }
	        });
  		};
  }]);

webikeControllers.controller('HistoryController', ['$scope', '$http',
  function ($scope, $http) {
   
  }]);

webikeControllers.controller('HomeController', ['$scope', '$http',
  function ($scope, $http) {
   
  }]);

webikeControllers.controller('PerformancesController', ['$scope', '$http',
  function ($scope, $http) {
   
  }]);