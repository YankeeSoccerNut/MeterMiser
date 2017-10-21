
// TODO: resolve asynch timing issues with calls to google API...
// examples...map works intermittently, relying on geocodes return

$(document).ready(()=>{

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
      newButtonHTML += `<button type="submit" class="btn-location-buttons btn-lg" location-id=${locations[i].locationId} style="width: 70%;"><i class="material-icons dp48">business</i>${locations[i].name}</button>`;

      geocodes.push(markLocation(myGeocoder, locations[i], myMap, markerBounds));
      console.log(`geocodes after push ${geocodes}`);

    }; // looping through locations

    // now update the DOM...
    // console.log(newButtonHTML);
    $('.location-buttons').html(newButtonHTML);

    // adjust the map based on where we put the markers....
    adjustMapView(geocodes, myMap);

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

  function adjustMapView(geocodes, map) {
    console.log (`geocodes: ${geocodes}`);
    // var markerBounds = new google.maps.LatLngBounds();

    // for (let i = 0; i < markers.length; i++) {
    //      map.addOverlay(new GMarker(randomPoint));
    //      markerBounds.extend(randomPoint);
    //   }
    //
    //   map.setCenter(markerBounds.getCenter(),
    //                 map.getBoundsZoomLevel(markerBounds));
    // map.setZoom(10); not sure this is needed if markerBounds.extend works
  };  // adjustMapView

    // // markers array
    // var markers = [];
    // var infoWindow = new google.maps.InfoWindow({});
    //
    // cities.map((city)=>{
    //   createMarker(myMap, city);
    // });
    //
    // // Add submit listener to the form
    // $('#filter-form').submit(function(event){
    //   // wipe out all the markers
    //   markers.map((marker)=>{
    //     marker.setMap(null);
    //   });
    //
    // $('.city-zoom').click(function () {
    //   console.log($(this));
    //   var index = $(this).attr('index)');
    // });
    //
    //   event.preventDefault();
    //   // user submitted the input box
    //   // console.log("User submission!");
    //   var userSearch = $('#filter-input').val().toLowerCase();
    //   listHTML = '';
    //   cities.map((city)=>{
    //     var cityName = city.city.toLowerCase();
    //     if(cityName.indexOf(userSearch) > -1){
    //       // The city we are on, contains the search text the user entered
    //       createMarker(myMap,city);
    //       listHTML += addCityToList(city);
    //     }
    //   });  // cities.map
    //   $('#cities-table tbody').html(listHTML);
    //
    // });  // filter-form submit


});  // document ready
