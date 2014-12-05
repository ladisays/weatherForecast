var weatherForecast = {

  init: function() {
    this.getCurrentLocation;
    this.$address = $('#address');
    this.$locationMap = $('#locationMap');
    this.$form = $('form');
    this.$form.submit(function (e) {
      e.preventDefault();
    });
    this.locationArray = [];

    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(this.coordsLatitude, this.coordsLongitude)
    };

    var map = new google.maps.Map(document.getElementById('locationMap'), mapOptions);
  },

  getCurrentLocation: function() {
    if(navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
      alert("Geolocation is not supported by this browser.");
    }

    function showPosition(pos){
      weatherForecast.coordsLatitude = pos.coords.latitude;
      weatherForecast.coordsLongitude = pos.coords.longitude;
      alert("Latitude: "+pos.coords.latitude+"nLongitude: "+pos.coords.longitude);
    }
  },

  getValueFromCallback: function(output) {
    if(output.length > 0) {
      this.coordsLatitude = output[0];
      this.coordsLongitude = output[1];
      console.log(this.coordsLatitude);
      console.log(this.coordsLongitude);
    }

    else {
      console.log("Oops! Couldn't calculate the co-ordinates for the specified address.");
    }
  },

  getGeoLocation: function(addLoc) {
    var geocoder = new google.maps.Geocoder();
    var loca = [];
    geocoder.geocode( {'address': addLoc}, function(results) {
      var locationDetails = results[0].geometry.location;
      loca.push(locationDetails.lat());
      loca.push(locationDetails.lng());
      weatherForecast.getValueFromCallback(loca);
    });
  },

  getWeatherInfo: function(lat, lon) {
    var url = 'https://api.forecast.io/forecast/e5ffdd91b1fb638fdf571cfd84c76c8d/';
    url += this.coordsLatitude;
    url += ',';
    url += this.coordsLongitude;
    url += '?callback=?';

    function displayForecast(fc) {
      console.log(fc);
      $('#forecast').html(fc);
    }

    console.log($.getJSON(url, displayForecast));
  }
};
google.maps.event.addDomListener(window, 'load', weatherForecast.init);

$(document).ready(function() {
  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else
  {
    alert("Geolocation is not supported by this browser.");
  }
  function showPosition(pos){
    weatherForecast.coordsLatitude = pos.coords.latitude;
    weatherForecast.coordsLongitude = pos.coords.longitude;
    weatherForecast.init();
    console.log("Latitude: "+pos.coords.latitude+" Longitude: "+pos.coords.longitude);
  }
});



// function geoLocation(addLoc) {
//   var locationDetails;
//   var geocoder = new google.maps.Geocoder();
//   geocoder.geocode( {'address': addLoc}, function(results) {
//     locationDetails = results[0].geometry.location;
//     var loca = [locationDetails.B, locationDetails.k];
//     out(loca);
//   }); 
//   // console.log(loc);
// }

// function out(results) {
//   console.log(results);
//   $('#forecast').html(results);
// }













