$(document).ready(()=>{

  // hard coding SVG size for now...TODO:  make it dynamic
  // 1. set the dimensions and margins of the graph
  var margin = {top: 30, right: 20, bottom: 70, left: 50},
      width = 1920 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // 2. parse the date / time
  var strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

  // 3. set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // 4. Define the axes
  var xAxis = d3.axisBottom(x).tickFormat(function(d){ return d.thermoStatId;});

  var yAxis = d3.axisLeft(y)
      .ticks(10);

  // 5.  define the line
  var myLine = d3.line()
    .x(function(d) { return x(d.thermCreated); })
    .y(function(d) { return y(d.dispTemp); });

  // 6.  append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // 7. Get the readings data

  var getReadingsURL = 'http://ec2-18-221-219-61.us-east-2.compute.amazonaws.com/Readings';

  d3.json(getReadingsURL, function(error, data) {
    // 8.  format the data
      data.forEach(function(d) {
          d.thermCreated = strictIsoParse(d.thermCreated);
          d.dispTemp = +d.dispTemp;
      });

      // 9.  Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.thermCreated; }));
      y.domain([60, d3.max(data, function(d) { return d.dispTemp; })]);

      // 10.  Nest the entries by thermostatId
      var dataNest = d3.nest()
          .key(function(d) {return d.thermostatId;})
          .entries(data);

      // 11.  Loop through each key (thermostatId)
      // lot going on here....
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      var legendSpace = width/dataNest.length;  // to add legend

      dataNest.forEach(function(d, i) {  // d is data point, i is the index value
          svg.append("path")
              .attr("class", "line")
              .style("stroke", function() {
                return d.color = color(d.key); })
              .attr("d", myLine(d.values));

              // Add the Legend
           svg.append("text")
               .attr("x", (legendSpace/2)+i*legendSpace)
               .attr("y", height + (margin.bottom/2)+ 5)
               .attr("class", "legend")
               .style("fill", function() {
                   return d.color = color(d.key); })
               .text(d.key);
      });  // dataNest.forEach

      // 12.  Add the x Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);


      // 13.  Add the y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      // text label for the y axis

  });  // d3 getReadings request
}); // document ready
