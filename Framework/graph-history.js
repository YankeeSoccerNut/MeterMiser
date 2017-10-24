$(document).ready(()=>{

	// Set the dimensions of the canvas / graph
	var margin = {top: 10, right: 20, bottom: 40, left: 30};
	var width = 350 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	// Adds the svg canvas
	var svg = d3.select("#graph-container") .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform",
	              "translate(" + margin.left + "," + margin.top + ")");

	// Set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleBand().range([0, height]).paddingInner(0.1).paddingOuter(0.1);

	// Define the axes
	var xAxis = d3.axisBottom(x).ticks();
	var yAxis = d3.axisLeft(y).ticks(24);

	// Get the data
	d3.json('http://ec2-18-221-219-61.us-east-2.compute.amazonaws.com/Readings', function(error,data){
		console.log(data);
		var dataFormated = formatJSON(data);
		console.log(dataFormated);
		var dataByLocation = nestedLocation(dataFormated);


	// Timeframe Scales
	var mostRecent = d3.max(dataFormated, function(d){return d.dateTimeInfo.timeStamp});
	var fifteenMinutes = 15*60*1000;
	var halfHour = 31*60*1000;
	var oneDay = 24*60*60*1000;
	var oneWeek = oneDay*7;
	var oneMonth = oneDay*30;

	// Set Domains
	timeframeStart = new Date(mostRecent-oneDay);
	mostRecent = new Date(mostRecent);
	x.domain([new Date(mostRecent-oneDay), new Date(mostRecent)]);
	y.domain(['East Cobb', 'West Cobb', 'Roswell']);

	// // Add StoreHours
	// var startYear =
	// var startMonth = 
	// var startDay = timeframeStart.get(Day);


    // Add the rects.
    svg.selectAll(".rect")
		.data(dataFormated)
	.enter().append("rect")
		.attr("class", "rect")
		.attr("x", function(d) {return (x(d.dateTimeInfo.dateComplete)+margin.left); })
		.attr("y", function(d) {return y(d.location); })
		.attr("width", function(d) {return x(new Date(d.dateTimeInfo.timeStamp + halfHour)) - x(d.dateTimeInfo.dateComplete); })
		.attr("height", y.bandwidth())
		// .style("opacity", )
		.style("fill", function(d) {return colorPicker(d.status)})

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
          .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-45)" 
                });


    // Add the Y Axis

	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .selectAll("text")	
            .style("text-anchor", "middle")
            .attr("y", -10)
            .attr("dx", "5px")
            .attr("dy", "1px")
            .attr("transform", function(d) {
                return "rotate(-90)" 
                });
	});

	// create the legend
	var legKeys = ['Scheduled', 'Hold - Temporary', 'Hold - Permanent'];
	var colorArray = ['#27AE60','#F1C40F','#E74C3C'];
  	$('#legend').css('margin-left', margin.left);
 	 legKeys.forEach(function(legKey,i){
    $('#legend').append('<div class="swatch" style="background:' + colorArray[i] + '"></div>' + legKey);
 	 });

	// Add Event Listeners
	$('#oneDay').click(()=>{updateData('oneDay')});
	$('#oneWeek').click(()=>{updateData('oneWeek')});
	$('#oneMonth').click(()=>{updateData('oneMonth')});


	function formatJSON(rawData){
		var dataFormated = []
		rawData.forEach(function(d,i){
			dataFormated[i] = {};
			dataFormated[i].location = LocationName(d.thermostatId);
			dataFormated[i].dateTimeInfo = new DateTime(d.created);
			dataFormated[i].status = determineStatus(d.statusHeat, d.systemSwitchPos);
		})
		return dataFormated;
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
		if(systemSwitchPos == 1 || systemSwitchPos == 3){
			if(statusHeat == 0){
				return 'Scheduled';
			}else if(statusHeat == 1){
				return 'Hold - Temporary';
			}else if(statusHeat == 2){
				return 'Hold - Permanent'
			}
		}
		else if(systemSwitchPos == 2){
			return 'Off';
		}else{
			return 'error';
		}
	}

	function colorPicker(status){
		if(status == 'Off'){
        		return '#fff'
        }else if(status == 'Scheduled'){
        		return '#27AE60'
        }else if(status == 'Hold - Temporary'){
        		return '#F1C40F'
        }else if (status == 'Hold - Permanent'){
        		return '#E74C3C'
        }
	}

	function nestedLocation(dataFormated){
		d3.nest()
			.key(function(d) {return d.location}).sortKeys(d3.ascending)
			.key(function(d) {return d.dateTime}).sortKeys(d3.ascending)
			.entries(dataFormated);
	}

	function DateTime(dateString){
		this.timeStamp = Date.parse(dateString);
		this.dateComplete = new Date(dateString);
		this.year = this.dateComplete.getUTCFullYear();
		this.month = this.dateComplete.getUTCMonth();
		this.day = this.dateComplete.getUTCDay();
		this.date = this.dateComplete.getUTCDate();
		this.hour = this.dateComplete.getUTCHours();
		this.minute = this.dateComplete.getUTCMinutes();
	}

	function updateData(domain){
		var timeframe;
		if(domain == 'oneDay'){
			timeframe = 24*60*60*1000;
		}else if(domain == 'oneWeek'){
			timeframe = 24*60*60*1000*7;
		}else{
			timeframe = 24*60*60*1000*30;
		}
		// console.log(timeframe);
		// Get the data again
		d3.json('http://ec2-18-221-219-61.us-east-2.compute.amazonaws.com/Readings', function(error,data){
			console.log(data);
			var dataFormated = formatJSON(data);
			console.log(dataFormated);

		// Timeframe Scales
		var mostRecent = d3.max(dataFormated, function(d){return d.dateTimeInfo.timeStamp});
		var halfHour = 30*60*1000;
		// console.log(mostRecent);

		// Reset Domains
		x.domain([new Date(mostRecent-timeframe), new Date(mostRecent)]);
		// console.log(new Date(mostRecent-timeframe));
		y.domain(['East Cobb', 'West Cobb', 'Roswell']);

		 // Select the section we want to apply our changes to
	    var svg = d3.select("#graph-container");

	    // Data join
	    var rects = svg.selectAll('.rect')
	    	.data(dataFormated);

	    // Make the changes
	    //remove unneeded rects
	    rects.exit().remove();
	    //add any new rects
	    rects.enter().append('rect')
	    	.attr("class", "rect")
	    	.style("fill", function(d) {return colorPicker(d.status)})
		//update all rects to new position
		rects.transition()
			.duration(750)
			.attr("x", function(d) {return x(d.dateTimeInfo.dateComplete); })
			.attr("y", function(d) {return y(d.location); })
			.attr("width", function(d) {return x(new Date(d.dateTimeInfo.timeStamp + halfHour)) - x(d.dateTimeInfo.dateComplete); })
			.attr("height", y.bandwidth())
			// .style("opacity", )


	    svg.select(".x.axis").transition()
	    	.duration(750) // change the x axis
	        .call(xAxis)
	         .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-45)" 
                });
	    svg.select(".y.axis").transition() // change the y axis
	        .duration(750)
	        .call(yAxis)
	        .selectAll("text")	
            .style("text-anchor", "middle")
            .attr("y", -10)
            .attr("dx", "5px")
            .attr("dy", "1px")
            .attr("transform", function(d) {
                return "rotate(-90)" 
                });

	    });
	};


})
