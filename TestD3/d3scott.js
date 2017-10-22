$(document).ready(()=>{

	// let's get the readings data and see if we can get D3 to load it

	var getReadingsURL = 'http://ec2-18-221-219-61.us-east-2.compute.amazonaws.com/Readings';

	d3.json(getReadingsURL, function(error, data) {
	// $.getJSON(getReadingsURL, function( readings, status ) {
	// 	console.log(`readings: \n${readings}`);
	//
	// 	d3.json(readings, function(error, data) {
  //   console.log(`d3.json: \n${data}`); // this is your D3 data
	// 	});
	console.log (data);
	});  // getReadings request

}); // document ready
