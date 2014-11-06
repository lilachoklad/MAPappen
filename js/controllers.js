var toaControllers = angular.module('toaControllers', []);


    toaControllers.controller('ListController', function ($scope, $http){
		$http.get('js/toaletter.json').success(function(data) {
			$scope.toaletter = data;
			console.log (data);
		});
	});
    
toaControllers.controller('AppController', function AppController ($scope, $http, $log){

var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(57.709292 , 11.972647),  //Centrerar på Göteborg, nånstans i centrum. Geo location längre ner.
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
	
	var currentPage = document.URL.slice(-1); //Hämtar vilken sidan man befinner sig på genom att ta sista tecknet på URL-texten. OBS FULLÖSNING!

	var latlng;


	function computeTotalDistance(result) {
		var total = 0, i,
			myroute = result.routes[0];
		for (i = 0; i < myroute.legs.length; i++) {
			total += myroute.legs[i].distance.value;
		}
		total = total / 1000;
		$scope.$apply(function () {
			$scope.totalKm = total;
		});
	}

	
	
	
	
    //kod som var innan directions kom in

	
    //Funktionen createMarker anropas nedan när vi läser in vår datafil.
    var createMarker = function (info, index){
        console.log('createMarker');
        console.log(info);
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.namn,
            platsen: info.ort
        });
        marker.content = '<div class="infoWindowContent">' + info.ort + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
			if(index>=0 && index!=currentPage){ //om markern inte är currentPosition-markern och om markern inte är för nuvarande sidan
				window.location = "index.html#/undersida/"+index; //När man klickar på en marker kommer man till dess undersida
				location.reload();
			}
        });
        $scope.markers.push(marker);    
    }  

    //Vid klick av länk så ska infoFönstret visas
    $scope.openInfoWindow = function(e, selectedMarker){
        console.log('openInfoWindow');
        console.log(selectedMarker);
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }
    
    //Hämtar datafilen och lägger ut markers utifrån den informations som kommer tillbaka
    $http.get('js/toaletter.json').success(function(data){
        $log.debug(data);
        $scope.retur_data = data;
		if (currentPage == "t"){ // kollar om man är på huvudsidan
			for (i = 0; i < data.length; i++){
				createMarker(data[i], i);
			}
		}else{ // om man inte är på huvudsidan skapas bara markers för den utvalda sidan
			createMarker(data[currentPage], currentPage);
		}
    }); 
    
    //Hämtar nuvarande postition och lägger in info i debug-div. Samt centrerar om kartan.
    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.$apply();

        latlng = new google.maps.LatLng($scope.lat, $scope.lng);
        $scope.map.setCenter(latlng);
		
		var currentPosition = { //Variabel för geolocation marker på kartan
			lat: position.coords.latitude, 
			long: position.coords.longitude, 
			namn: "Här är du", 
			ort: ""
		};
		
		createMarker(currentPosition, -1);
    }

    //Hanterar felmeddelanden.
    $scope.showError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $scope.error = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                $scope.error = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                $scope.error = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                $scope.error = "An unknown error occurred."
                break;
        }
        $scope.$apply();
    }
    
    //Hämtar nuvarande platss
    $scope.getLocation = function () {
        if (navigator.geolocation) {
            //Anropar funtionen showPosition ovan om GeoLocation stöds av webbläsaren
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
			
			return navigator.geolocation.getCurrentPosition(function (position) {
			var pos = new google.maps.LatLng(position.coords.latitude,
											 position.coords.longitude);
			console.log(pos);
			return pos; });
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
		
    }

    //Kör ovanstående funktion getLocation.
    $scope.getLocation();
	
	//Directions
	if (currentPage != "t"){ // om den nuvarande sidan inte är t så körs directionsgrejen
		// defaults for your business location and blurb
		var streetAddress = "5111 47 St NE  Calgary, AB T3J 3R2",
			Location = new google.maps.LatLng(51.098945, -113.970889),
			businessWriteup = "<b>Calgary Police Service</b><br/>Calgary's Finest<br/>",
			defaultFromAddress = 'Calgary',
			businessTitle = "Calgary Police Service",
			directionsService = new google.maps.DirectionsService(),
			directionsDisplay = new google.maps.DirectionsRenderer({
				draggable: true
			});

		// add your fixed business marker
		var contentString = businessWriteup + streetAddress
		  marker = new google.maps.Marker({
			  position: Location,
			  map: $scope.map,
			  title: businessTitle,
			  animation: google.maps.Animation.DROP
		  });
		// show info Window
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open($scope.map, marker);
		});

		directionsDisplay.setMap($scope.map);
		directionsDisplay.setPanel(document.getElementById('directions'));

		console.log($scope.getLocation());
		$scope.fromAddress = $scope.getLocation (); 
		$scope.selectedOption = 'Driving';
		$scope.options = ['Driving', 'Walking', 'Bicycling', 'Transit'];
		$scope.totalKm = 0;

		$scope.setDirections = function () {
			var selectedMode = $scope.selectedOption.toUpperCase() || 'DRIVING',
				from = $scope.fromAddress || defaultFromAddress,
				request = {
					origin: from,
					destination: streetAddress,
					travelMode: selectedMode,
					provideRouteAlternatives: true,
					unitSystem: google.maps.UnitSystem.METRIC,
					optimizeWaypoints: true
				};
			if (selectedMode === 'TRANSIT') {
				request.transitOptions = {
					departureTime: new Date()
				};
			}

			directionsService.route(request, function (response, status) {
				if (status === google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				} else {
					toastr.error(status);
				}
			});
		}


		google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {

			computeTotalDistance(directionsDisplay.directions);
			try {
				if (directionsDisplay.directions.routes[0].legs[0]) {

					$scope.$apply(function () {
						$scope.fromAddress = directionsDisplay.directions.routes[0].legs[0].start_address;
					});
				}
			} catch (e) { }
		});

		// fire it up initially

			$scope.setDirections();
			
			
		// watch if the mode has changed
		$scope.$watch('selectedOption', function (newValue, oldValue) { $scope.setDirections(); });
	
	} //slut på ifsatsen runt directions
    
});


//Kod för att hämta vilket id en specifik toa har

toaControllers.controller('UndersidaController', function ($scope, $http, $routeParams){
        $http.get('js/toaletter.json').success(function(data) {
            $scope.toaletter = data;
            $scope.whichItem = $routeParams.itemId;
            console.log (data);
        });
    

});

