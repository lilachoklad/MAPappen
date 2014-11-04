var toaControllers = angular.module('toaControllers',[]);

	toaControllers.controller('ListController', function ($scope, $http){
		$http.get('js/toaletter.json').success(function(data) {
			$scope.toaletter = data;
			console.log (data);
		});
});

	toaControllers.controller('UndersidaController', function ($scope, $http, $routeParams){
			$http.get('js/toaletter.json').success(function(data) {
				$scope.toaletter = data;
				$scope.whichItem = $routeParams.itemId;
				console.log (data);
			});
	});
	

	
	
myApp.controller('mainController', function ($scope) {
	$scope.pageClass = 'list'
});

myApp.controller('detaljController', function ($scope) {
	$scope.pageClass = 'undersida'
});