var weatherForecast = {

  init: function() {
    var self = this;
    this.getCurrentLocation(true);
    this.$address = $('#address').geocomplete();
    this.$locationMap = $('#locationMap');
    this.$form = $('form');
    this.$form.submit(function (e) {
      e.preventDefault();

      if(self.$address.val() === "") {
        alert("Please put in an address!");
      }

      else {

        self.getGeoLocation(self.$address.val());
        self.$address.val("");
        $('#home').show('slow');
      }
    });
    this.locationArray = [];
  },

  getCurrentLocation: function(showAlert) {
    var self = this;
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }

    else {
      alert("Geolocation is not supported by this browser.");
    }

    function showPosition(pos) {
      self.coordsLatitude = pos.coords.latitude;
      self.coordsLongitude = pos.coords.longitude;
      
      var coords = new Array(2);
      coords[0] = self.coordsLatitude;
      coords[1] = self.coordsLongitude;

      self.createMap(coords[0], coords[1], 'Your Current Location!')
      
      self.getWeatherInfo(coords[0], coords[1]);
    }

    if(showAlert === true) {
      $alert = $('#alert').show('slow');

      $btnAlert = $('#closeAlertInfo').click(function(){
        return $alert.hide();
      });
    }
  },

  getJSON: function(url, callback) {
    if($.getJSON(url, callback)) {
      return true;
    }
    else {
      alert('Unable to fetch weather forecast');
      return false;
    }
  },

  createMap: function(lat, lon, markerTitle) {
    // $('#address').prop("disabled", true);
    // $('#btnSearch').attr('disabled', true).text('Searching...');
    var mapCoordinates = new google.maps.LatLng(lat, lon),
      
        mapOptions = {
          zoom: 15,
          center: mapCoordinates
        },

        map = new google.maps.Map(document.getElementById('locationMap'), mapOptions),

        marker = new google.maps.Marker({
          position: mapCoordinates,
          map: map,
          title: markerTitle
        });

    return;
  },

  getValueFromCallback: function(output) {
    if(output.length > 0) {
      this.coordsLatitude = output[0];
      this.coordsLongitude = output[1];
      this.formattedAddress = output[2];
      this.getWeatherInfo(this.coordsLatitude, this.coordsLongitude);
      this.createMap(this.coordsLatitude, this.coordsLongitude, 'Map Position');
    }
  },

  getGeoLocation: function(addLoc) {
    var self = this;
    var geocoder = new google.maps.Geocoder();
    var loca = [];
    geocoder.geocode({'address': addLoc}, function(results, status) {
      if(status === "OK") {
        var formattedAddress = results[0].formatted_address,
            locationDetails = results[0].geometry.location;
        // console.log(status, results);
        loca.push(locationDetails.lat());
        loca.push(locationDetails.lng());
        loca.push(formattedAddress);
        self.getValueFromCallback(loca);
      }
      else {
        return alert('Oops! We are sorry.\nWe could not process your request.\nPlease try again later.');
      }
    });
  },

  getWeatherInfo: function(lat, lon) {

    var url = 'https://api.forecast.io/forecast/e5ffdd91b1fb638fdf571cfd84c76c8d/',
        self = this;
    url += lat;
    url += ',';
    url += lon;
    url += '?callback=?';

    function timeConverter(timestamp){
      var a = new Date(timestamp * 1000),
          fullDate = a.toUTCString();
      day = fullDate[0] + fullDate[1] + fullDate[2];
      return day;
    }

    function displayForecast(fc) {
      //console.log(fc);
      var temp = Math.round(((fc.currently.temperature - 32) * 5) / 9),
          time = timeConverter(fc.currently.time),
          imgSrc = 'images/' + fc.currently.icon + '.png',
          $div = $('<div>'),
          $weatherIcon = $('<img>').attr('src', imgSrc),
          $Summary = $('<h2>').text(fc.currently.summary),
          $HourlySummary = $('<h4>').text(fc.hourly.summary),
          $Temperature = $('<h1>').text(temp + "\u00B0" + "c"),
          $Address = $('<h3>').text(weatherForecast.formattedAddress),
          weeklyHTML = '<div><ul>';

      $div.append($weatherIcon, $Temperature, $Summary, $HourlySummary, $Address);
      $('#forecast').html($div);

      $.each(fc.daily.data, function(index, day) {
        var weekday = timeConverter(day.time),
            dailyIMG = 'images/' + day.icon + '.png';

        weeklyHTML += '<li><span>' + weekday.toUpperCase() + '</span>';
        weeklyHTML += '<img src="' + dailyIMG + '"/>';
        weeklyHTML += day.summary + '</li>';
      });

      weeklyHTML += '</ul></div>';

      return $('#weeklyForecast').html(weeklyHTML);
    }

    if(self.getJSON(url, displayForecast)) {
      return true;
    }
    else {
      alert('We are not able to get you the forecast for now!\nPlease try again later.');

      return false;
    }
  }
};


// google.maps.event.addDomListener(window, 'load', weatherForecast.getCurrentLocation);

// Once the page is fully rendered,
// hide the home icon at the top-left corner
// set the click function of the home icon (when visible)
// to get the current user's location on the map
$(document).ready(function() {
  // $content.hide(); 
  $('#home').hide();
  $('#home').click(function(){
    return weatherForecast.getCurrentLocation();
  });

  $('#weeklyForecast').hide();

  weatherForecast.init();

  var $div = $('<div>').html('Loading...');
  $('#forecast').html($div);

  $('#forecast').click(function () {
    return $('#weeklyForecast').toggle('slow');
  });

  return;
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
