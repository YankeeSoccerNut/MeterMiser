$(document).ready(()=>{

  // hard coding SVG size for now...TODO:  make it dynamic
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 50, left: 70},
      width = 1920 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // parse the date / time
  var strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the line
  var myLine = d3.line()
    .x(function(d) { return x(d.thermCreated); })
    .y(function(d) { return y(d.dispTemp); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // let's get the readings data and see if we can get D3 to load it

  var getReadingsURL = 'http://ec2-18-221-219-61.us-east-2.compute.amazonaws.com/Readings';

  d3.json(getReadingsURL, function(error, data) {
    console.log (data);

    // format the data
      data.forEach(function(d) {
          d.thermCreated = strictIsoParse(d.thermCreated);
          d.dispTemp = d.dispTemp;
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.thermCreated; }));
      y.domain([60, d3.max(data, function(d) { return d.dispTemp; })]);

      // Add myLine to the path.
      svg.append("path")
          .data([data])
          .attr("class", "line")
          .attr("d", myLine);

    // Add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // text label for the x axis
      svg.append("text")
          .attr("transform",
                "translate(" + (width/2) + " ," +
                               (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .text("Date");

      // Add the y Axis
      svg.append("g")
          .call(d3.axisLeft(y));

      // text label for the y axis
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Temperature");

  });  // d3 getReadings request

}); // document ready
