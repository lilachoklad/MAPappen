var myApp = angular.module('myApp',[]);

	myApp.controller('MyController', function MyController($scope) {

		$scope.toaletter = [
			{
				'namn': 'City Avenyn',
				'adress': 'Kungsportsavenyn 34',
				'oppettider': '07-21',
				'gratis': 'Ja',
				'handikappanpassad': 'Ja',
				'skotbord': 'Ja'
			},

			{
				'namn': 'Stadsmuseet',
				'adress': 'Norra Hamngatan 12',
				'oppettider': 'Dygnet runt',
				'gratis': 'Ja',
				'handikappanpassad': 'Ja',
				'skotbord': 'Ja'
			},

			{
				'namn': 'Hemköp',
				'adress': 'Hvitfeldtsplatsen 3',
				'oppettider': '08-22',
				'gratis': 'Nej',
				'handikappanpassad': 'Ja',
				'skotbord': 'Ja'
			}
			

		]
});