var myNameSpace = angular.module('myApp', []);

myNameSpace.controller('MyController', function MyController($scope) {



	$scope.toaletter = {
		'namn' : 'City Avenyn',
		'adress' : 'Kungsportsavenyn 34',
		'oppettider' : '07-21',
		'gratis' : 'Ja',
		'handikappanpassad' : 'Ja',
		'skotbord' : 'Ja'
	}
});