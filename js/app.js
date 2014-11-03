var myApp = angular.module('myApp', [
	'ngRoute',
	'toaControllers'
]);

myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/list', {
		templateUrl: 'partials/list.html',
		controller: 'ListController'
	}).
	otherwhise({
		redirectTo: '/list'
	});
	
}])