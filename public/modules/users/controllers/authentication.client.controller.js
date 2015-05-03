'use strict';

angular.module(ApplicationConfiguration.modules.user)
.controller('AuthenticationController', [
	'$scope', 
	'$http', 
	ApplicationConfiguration.services.authentication,
	ApplicationConfiguration.services.utilities,
	function($scope, $http, Authentication, utilSrv) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user){
			utilSrv.go('home');	
		}

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				if($scope.authentication.user.role === 'GAMBLER'){
					utilSrv.util.go('gamblermainState.panel');
				}else if($scope.authentication.user.role === 'TRADER'){
					utilSrv.util.go('tradermainState.panel');
				}else{
					utilSrv.util.go('home');
				}
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				if($scope.authentication.user.role === 'GAMBLER'){
					utilSrv.util.go('gamblermainState.panel');
				}else if($scope.authentication.user.role === 'TRADER'){
					utilSrv.util.go('tradermainState.panel');
				}else{
					utilSrv.util.go('home');
				}
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);