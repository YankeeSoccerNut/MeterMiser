
// TODO: resolve asynch timing issues with calls to google API...
// examples...map works intermittently, relying on geocodes return
var firstTime = true;

$(document).ready(()=>{

// Add a change listener to the Toggle button which is actually a checkbox.
// hide or show the appropriate div depending on the checked status
// Map -- show map, hide list of buttons....may need to add listeners to markers in order to navigate to detail view for locations
// List -- show buttons....add listeners for buttons to navigate to detail view for locations

  $("#list-map-toggle").change(function() {
    console.log( "#list-map-toggle changed" );
    if ($(this).is(':checked')) {   // map
      $(".location-buttons").hide();
      $("#locations-map").show();
    } else {                        // list
      $("#locations-map").hide();
      $(".location-buttons").show();
    };
  });


// To load up Google Maps in javascript versus src tag in HTML..
  var googMapURL = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&callback=initMap`;

  $.ajax({
      type: 'GET',
      url: googMapURL,
      dataType: 'jsonp',
      jsonpCallback: 'initMap',
      async: false, // this is by default false, so not need to mention
      crossDomain: true // tell the browser to allow cross domain calls.
  });  // ajax call to load googleMap


// Use the express server to get locations for the user.
// Our demo is single user only
// TODO: Add capability to use actual authenticated user credentials to limit locations their own

  var getLocationsURL = 'http://ec2-18-221-219-61.us-east-2.compute.amazonaws.com/Locations';

  var locations = [];
  var status = '';
  var newButtonHTML = '';
  var currentReadings = [];

  $.get(getLocationsURL, function( locations, status ) {
    // display the initial map...
    var myMap = initMap();

    // get the geocoder we will need for the locations loop
    var myGeocoder = new google.maps.Geocoder();
    var geocodes =[];

    // get the boundaries object that we will use to constrain the map view later...

    var markerBounds = new google.maps.LatLngBounds();

    for (let i=0; i < locations.length; i++){
      // stash the locationId as an attrib in the button for later use (e.g. clicked event)

      // get a current reading....TODO:  asynch timing issue on console.log?
      var getCurrentReadingURL = 'http://ec2-18-221-219-61.us-east-2.compute.amazonaws.com/Now?';

      getCurrentReadingURL += `thermostatId=${locations[i].thermostatId}`;
      console.log(getCurrentReadingURL);

      $.get(getCurrentReadingURL), function (currentReading, status) {
        console.log(`currentReading: ${currentReading}`);
        currentReadings.push(currentReading);
      };

      newButtonHTML += `<button type="submit" class="btn-location-buttons btn-lg" thermostat-id=${locations[i].thermostatId} style="width: 70%;"><i class="material-icons dp48">business</i>${locations[i].name}</button>`;

      geocodes.push(markLocation(myGeocoder, locations[i], myMap, markerBounds));
      console.log(`geocodes after push ${geocodes}`);

    }; // looping through locations

    console.log(currentReadings);
    // now update the DOM...
    // console.log(newButtonHTML);
    $('.location-buttons').html(newButtonHTML);

  });  // getLocations request

  function initMap(){

    var myLatLng = {
      lat:  40.0000,
      lng: -98.0000
    };

    var myMap = new google.maps.Map(document.getElementById('locations-map'), {
      zoom: 4,
      center: myLatLng
    });

    return(myMap);
  };  // initMap

  function markLocation(geocoder, location, map, markerBounds) {
    var address = `${location.addr1}, ${location.city}, ${location.state}, ${location.zip5}`;
    var geocode = null;
    console.log (address);

    geocode = geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: location.name
        });
        // TODO: dig in and understand this code...relates to timing issues too....I'm doing it EVERY TIME.  It would be nice to do setCenter once
        markerBounds.extend(results[0].geometry.location);
        map.fitBounds(markerBounds);
        return (geocode);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });  // geocode
  }; // markLocation

});  // document ready
