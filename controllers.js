var minaControllers  = angular.module('minaControllers', []);

minaControllers.controller('myApp', function AppController($scope, $http, $log){
    
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(37.361971 , -122.032356),  //Centrerar på San Francisco. Geo location längre ner.
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    //Funktionen createMarker anropas nedan när vi läser in vår datafil.
    var createMarker = function (info){
        console.log('createMarker');
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
    $http.get('toaletter.json').success(function(data){
        $log.debug(data);
        $scope.retur_data = data;
        for (i = 0; i < data.length; i++){
            createMarker(data[i]);
        }
    }); 
    
    //Hämtar nuvarande postition och lägger in info i debug-div. Samt centrerar om kartan.
    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.$apply();

        var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
        $scope.map.setCenter(latlng);
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
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

    //Kör ovanstående funktion getLocation.
    $scope.getLocation();
});