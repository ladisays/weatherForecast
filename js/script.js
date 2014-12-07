var weatherForecast = {

  init: function() {
    this.getCurrentLocation();
    this.$address = $('#address');
    this.$locationMap = $('#locationMap');
    this.$form = $('form');
    this.$form.submit(function (e) {
      e.preventDefault();
      weatherForecast.getGeoLocation(weatherForecast.$address.val());
    });
    this.locationArray = [];
  },

  getCurrentLocation: function() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }

    else {
      alert("Geolocation is not supported by this browser.");
    }

    function showPosition(pos) {
      weatherForecast.coordsLatitude = pos.coords.latitude;
      weatherForecast.coordsLongitude = pos.coords.longitude;
      
      var coords = new Array(2);
      coords[0] = weatherForecast.coordsLatitude;
      coords[1] = weatherForecast.coordsLongitude;

      weatherForecast.createMap(coords[0], coords[1], 'Your Current Location!');
      
      weatherForecast.getWeatherInfo(coords[0], coords[1]);
    }

    $alert = $('#alert').show('slow');
    // $alert.click(function() {
    //   $alert.hide();
    // });

    $btnAlert = $('#closeAlertInfo').click(function(){
      $alert.hide();
    });
  },

  createMap: function(lat, lon, markerTitle) {
    var mapCoordinates = new google.maps.LatLng(lat, lon);
      
    var mapOptions = {
      zoom: 15,
      center: mapCoordinates
    };

    var map = new google.maps.Map(document.getElementById('locationMap'), mapOptions);

    var marker = new google.maps.Marker({
      position: mapCoordinates,
      map: map,
      title: markerTitle
    });
  },

  getValueFromCallback: function(output) {
    if(output.length > 0) {
      this.coordsLatitude = output[0];
      this.coordsLongitude = output[1];
      this.formattedAddress = output[2];
      this.getWeatherInfo(this.coordsLatitude, this.coordsLongitude);
      this.createMap(this.coordsLatitude, this.coordsLongitude, 'Map Position');
      // console.log(this.coordsLatitude);
      // console.log(this.coordsLongitude);
    }

    else {
      console.log("Oops! Couldn't calculate the co-ordinates for the specified address.");
    }
  },

  getGeoLocation: function(addLoc) {
    var geocoder = new google.maps.Geocoder();
    var loca = [];
    geocoder.geocode( {'address': addLoc}, function(results) {
      var formattedAddress = results[0].formatted_address;
      var locationDetails = results[0].geometry.location;
      loca.push(locationDetails.lat());
      loca.push(locationDetails.lng());
      loca.push(formattedAddress);
      weatherForecast.getValueFromCallback(loca);
    });
  },

  getWeatherInfo: function(lat, lon) {
    var url = 'https://api.forecast.io/forecast/e5ffdd91b1fb638fdf571cfd84c76c8d/';
    url += lat;
    url += ',';
    url += lon;
    url += '?callback=?';

    function timeConverter(timestamp){
      var a = new Date(timestamp * 1000);
      var fullDate = a.toUTCString();
      day = fullDate[0] + fullDate[1] + fullDate[2];
      return day;
    }

    function displayForecast(fc) {
      //console.log(fc);
      var temp = Math.round(((fc.currently.temperature - 32) * 5) / 9);
      var time = timeConverter(fc.currently.time);
      //console.log(time);
      var imgSrc = 'images/' + fc.currently.icon + '.png';
      $div = $('<div>');
      $weatherIcon = $('<img>').attr('src', imgSrc);
      $Summary = $('<h2>').text(fc.currently.summary);
      $HourlySummary = $('<h4>').text(fc.hourly.summary);
      $Temperature = $('<h1>').text(temp + "\u00B0" + "c");
      $Address = $('<h3>').text(weatherForecast.formattedAddress);
      $div.append($weatherIcon, $Temperature, $Summary, $HourlySummary, $Address);
      $('#forecast').html($div);

      var weeklyHTML = '<div><ul>';

      $.each(fc.daily.data, function(index, day) {
        var weekday = timeConverter(day.time);
        var dailyIMG = 'images/' + day.icon + '.png';

        // console.log(index, day, weekday);
        weeklyHTML += '<li><span>' + weekday.toUpperCase() + '</span> ';
        weeklyHTML += '<img src="' + dailyIMG + '"/>';
        weeklyHTML += ' ' + day.summary + '</li>';
      });

      weeklyHTML += '</ul></div>';
      $('#weeklyForecast').html(weeklyHTML);

      $('#forecast').click(function () {
        $('#weeklyForecast').hide('slow');
      });
    }

    $.getJSON(url, displayForecast);
  }
};


// google.maps.event.addDomListener(window, 'load', weatherForecast.getCurrentLocation);

$(document).ready(function() {
  // $content.hide(); 
  $alert = $('#alert').hide();
  weatherForecast.init();
});













// console.log(a.toUTCString(), a.getDay());
// var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// var year = a.getFullYear();
// var month = months[a.getMonth()];
// var date = a.getDate();
// var hour = a.getHours();
// var min = a.getMinutes();
// var sec = a.getSeconds();
// var time = month + ' ' + date + ',' + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
