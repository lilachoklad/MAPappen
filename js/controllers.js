﻿var toaControllers = angular.module('toaControllers',[]);

	toaControllers.controller('ListController', function toaController($scope, $http){
		$http.get('js/toaletter.json').success(function(data) {
			$scope.toaletter = data;
			console.log (data);
		});

});