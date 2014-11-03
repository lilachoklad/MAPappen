var myApp = angular.module('myApp',[]);

	myApp.controller('MyController', function MyController($scope, $http){
		$http.get('toaletter.json').success(function(data) {
			$scope.toaletter = data;
			console.log (data);
		});

});