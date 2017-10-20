$(document).ready(()=>{

// Use the express server to get locations for the user.
// Our demo is single user only
// TODO: Add capability to use actual authenticated user credentials to limit locations their own

  var getLocationsURL = 'http://ec2-18-221-219-61.us-east-2.compute.amazonaws.com/Locations';

  var locations = [];
  var status = '';
  var newButtonHTML = ''

  $.get(getLocationsURL, function( locations, status ) {
    // console.log(status);

    for (let i=0; i < locations.length; i++){
      console.log (locations[i].locationId);
      console.log(locations[i].name);
      console.log(locations[i].addr1);
      console.log(locations[i].addr2);
      console.log(locations[i].city);
      console.log(locations[i].zip5);
      console.log(locations[i].zip4);

      // stash the locationId as an attrib in the button for later use (e.g. clicked event)
      newButtonHTML += `<button type="submit" class="btn-location-buttons btn-lg" location-id=${locations[i].locationId} style="width: 70%;"><i class="material-icons dp48">business</i>${locations[i].name}</button>`;
    } // looping through locations

    // now update the DOM...
    console.log(newButtonHTML);
    $('.location-buttons').html(newButtonHTML);
  });  // getLocations request

});  // document ready
