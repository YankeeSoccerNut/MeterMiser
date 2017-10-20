// var d3 = require('d3');

$(document).ready(()=>{

	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50}; 
	var width = 500 - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

	// Parse the date / time
	console.log(d3);
	var parseDate = d3.timeFormat("%Y-%m-%dT%H:%M:%S.%LZ");

	// Set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleBand()
	.domain(['East Cobb', 'West Cobb', 'Roswell'])
	.range([height, 0])
	.paddingInner(0.1).paddingOuter(0.05);
	// console.log(y(each location))
	// console.log(y.bandwith())
			
	

	
	// Adds the svg canvas
	var svg = d3.select("body") .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform",
	              "translate(" + margin.left + "," + margin.top + ")");

	// Define the axes
	// var xAxis = d3.svg.axis().scale(x) .orient("bottom").ticks();
	// var yAxis = d3.svg.axis().scale(y) .orient("left").ticks(24);

	// Get the data
	d3.json('https://api.myjson.com/bins/1grppr', function(error,data){
				console.log(data);
		var dataFormated = formatJSON(data);
		console.log(dataFormated);
		var dataByLocation = nestedLocation(dataFormated);

		// Scale the range of the data
		 var halfHour = 30+60+1000;
		 var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		 var oneWeek = oneDay*7;
		 var now = new Date().getTime();
		 x.domain(now-oneDay); 


    // Add the rects.
    svg.selectAll(".rect")
		.data(dataFormated)
	.enter().append("rect")
		.attr("class", "rect")
		.attr("x", function(d) { console.log(d.dateTime); return x(d.dateTime); }) 
		.attr("y", function(d) {return y(d.location); }) 
		.attr("width", function(d) { return x(d.dateTime+halfHour); }) 
		.attr("height", function(d) { return y(d.location+bandwith)}) 
		.style("opacity", 0.3)
		.style("fill", function(d) {return color(d.status)})
		// .attr("rx", 10)
		// .attr("ry", 10)

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    // Add the Y Axis

	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis);






	})

	 









	function formatJSON(rawData){
		var dataFormated = []
		rawData.forEach(function(d,i){
			dataFormated[i] = {};
			dataFormated[i].location = LocationName(d.thermostatId);
			dataFormated[i].dateTime = Date.parse(d.created);
			dataFormated[i].equipmentStatus = determineStatus(d.systemSwitchPos, d.statusHeat);
		})
		return dataFormated
	}


	function LocationName(thermostatId){
		if(thermostatId == 581279){
			return 'Roswell';
		}
		else if(thermostatId == 594679){
			return 'East Cobb';
		}
		else if(thermostatId == 597696){
			return 'West Cobb';
		}
		else{
			return 'Not Valid Id';
		}
	}

	function determineStatus(statusHeat,systemSwitchPos){
		if(systemSwitchPos == 2){
			return 'Off'
		}else{
			if(statusHeat == 0){
				return 'Scheduled'
			}else{
				return 'Hold'
			}
		}
	}

	function nestedLocation(dataFormated){
		d3.nest()
			.key(function(d) {return d.location}).sortKeys(d3.ascending)
			.key(function(d) {return d.dateTime}).sortKeys(d3.ascending)
			.entries(dataFormated);
	}

})




// 			return 'Temporary Hold'
// 		}else if(statusHeat == 2){
// 			return 'Permanent Hold'
// 		}else{
// 			return 'Vacation Hold'
// 		}

// // 	}

// // function isOpen()

// var simpData = rawData.map.forEach(function(d){
// 	d.location = d.LocationName(d.thermostatId);
// 	d.status = d.determineStatus(d.statusHeat,d.systemSwitchPosition);
// 	d.holdType = d.statusHeat;
// 	d.startTime = //parseTime
// 	d.endTime = //15(30) minutes or next data point...whichever is sooner
// 	d.temp = d.dispTemp 
	
// })










