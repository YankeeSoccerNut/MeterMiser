$(document).ready(()=>{

	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 30, left: 70}; 
	var width = 1000 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	// Adds the svg canvas
	var svg = d3.select("body") .append("svg")
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
	var halfHour = 30*60*1000;
	var oneDay = 24*60*60*1000;
	var oneWeek = oneDay*7;

	// Set Domains
	x.domain([new Date(mostRecent-oneDay), new Date(mostRecent)]);
	y.domain(['East Cobb', 'West Cobb', 'Roswell']);
	
	
    // Add the rects.
    svg.selectAll(".rect")
		.data(dataFormated)
	.enter().append("rect")
		.attr("class", "rect")
		.attr("x", function(d) {console.log(x(d.dateTimeInfo.dateComplete)); return x(d.dateTimeInfo.dateComplete); }) 
		.attr("y", function(d) {console.log(y(d.location)); return y(d.location); }) 
		.attr("width", function(d) {console.log(x(new Date(d.dateTimeInfo.timeStamp + halfHour)) - x(d.dateTimeInfo.dateComplete)); return x(new Date(d.dateTimeInfo.timeStamp + halfHour)) - x(d.dateTimeInfo.dateComplete); }) 
		.attr("height", y.bandwidth()) 
		// .style("opacity", )
		.style("fill", function(d) {
			if(d.equipmentStatus == "Scheduled"){
				return "#008000";
			}else if(d.equipmentStatus == "Hold"){
				return "#ff0000";
			}else{
				return "#cccccc"}
		})
		

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
			dataFormated[i].dateTimeInfo = new DateTime(d.created);
			dataFormated[i].equipmentStatus = determineStatus(d.statusHeat, d.systemSwitchPos);
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
		if(systemSwitchPos == 2){
			return 'Off';
		}else{
			if(statusHeat == 0 && systemSwitchPos != 2){
				return 'Scheduled';
			}else{
				return 'Hold';
			}
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

})



















