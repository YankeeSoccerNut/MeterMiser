$(document).ready(()=>{
	// $('#weather-form').submit((event)=>{
	// 	event.preventDefault();

	// 	var zipCode = $('#zip-code').val();
	// 	console.log(zipCode);
	// 	var weatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=imperial&appid=${APIKEY}`;
	// 	// console.log(weatherURL);

	// 	$.getJSON(weatherURL,(weatherData)=>{
	// 		console.log(weatherData);
	// 		var currTemp = weatherData.main.temp;
	// 		var minTemp = weatherData.main.temp_min;
	// 		var maxTemp = weatherData.main.temp_max;

	// 		var data = [minTemp,currTemp,maxTemp];
	// 		console.log(data);
	// 	})
	// })

	// SAMPLE DATA

	var numbers = [5,4,10,1];
	var data = [
		{ data: '2014-01-01', amount: 10 },
		{ date: '2014-02-01', amount: 20 },
    	{ date: '2014-03-01', amount: 40 },
    	{ date: '2014-04-01', amount: 80 }
    	];

    // SMALL HELPERS

    d3.min(numbers); 
    //computes min value of array...optional accessor function(see d3.max)
    //1

    d3.max(data, function(d, i) { return d.amount });
	// comuptes max value of array with accessor function applied....
	// call back function using element d and its index i returns value for amount key
	// 80

	d3.extent(numbers);
	// returns min and max value of array...optional accessor function
	// [1, 10]

	// SCALES

	var y = d3.scaleLinear()
		// .domain([0,80])
		.range([200,0]) //backwards cuz SVG is y-down
	// domain is data space...so units are source units
	// range is screen space (pixels)
	y.domain(d3.extent(data, function(d) { return d.amount }));

	// calling scale as function is how we translate values from one coordinate to another
	y(0) //in: $0 out: 200px(bottom of graph)
	y(80) //in: $80 out: 0px(top of graph)

	var x = d3.scaleTime()

	var x = d3.scaleTime()
		.domain([
	    	new Date(Date.parse('2014-01-01')),
	 		new Date(Date.parse('2014-04-01'))
		])
		.range([0, 300]);

	x(new Date(Date.parse('2014-02-01')));
	// 103.3811949976841

	// x is the d3.scaleTime()
	var xAxis = d3.axisBottom(x)
		.ticks(4); // specify the number of ticks

	var svg = d3.select('#temp-info')
		.append('svg')        // create an <svg> element
			.attr('width', 300) // set its dimentions
			.attr('height', 150);

	svg.append('g')            // create a <g> element
		.attr('class', 'x axis') // specify classes
		.call(xAxis);            // let the axis do its thing


    








})