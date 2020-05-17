function draw_bar(data, width, height) {
  plot_data = []

  for(i = 0; i < data.length; i++){
    d = {}
    d["key"] = data[i]["Country"]
    d["count"] = Math.log(data[i]["TotalConfirmed"])
    plot_data.push(d)
  }
  console.log(plot_data)
  var margin = 100;
  var svg = d3.select("#barchart").append("svg")
              .attr("width", (width) + "px")
              .attr("height", (height) + "px")
              .append('g')
              // .attr("transform", `translate(${margin / 1.5}, ${margin / 2})`);

  // svg = d3.select("body").append("svg")
  //         .attr("width", width)
  //         .attr("height", height)
  xdisp = 0
  ydsip = 0
  svg.attr("transform", "translate(" + xdisp + "," + ydsip + ")")

  // creating x and y axes
  var xScale = d3.scaleBand().range ([0, width - margin]).padding(0.4),
      yScale = d3.scaleLinear().range ([height - margin, 0]);

  // creating the group tag where all the elements of the graph would be appended
  var g = svg.append("g")
          .attr("transform", "translate(" + 80 + "," + 0 + ")")
          .style("align", "center");
      
  xScale.domain(plot_data.map(function(d){ return d["key"] }))
  yScale.domain([0, d3.max(plot_data, function(d){ return d["count"] })])

  // appending x axis
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
          .style("text-anchor", "start")
      .attr("dx", "1em")
      .attr("dy", "-.5em")
      .attr("transform", "rotate(90)");

  // adding labels for x axis
  g.append("text")
      .attr("transform", "translate("+ 130 +","+ (height+75) +")")
      .text('Principal Component')

  // appending y axis
  g.append("g")
      .attr("transform", "translate(0," + 0 + ")")
      .call(d3.axisLeft(yScale)
      .ticks(10))

  // adding labels for y axis
  svg.append("g")
      .attr("transform", "translate("+ 10 +","+ (200) +")")
      .append("text")
      .style("text-anchor", "start")
      .attr("transform","rotate(-90)")
      .text("Explained Variance")                

  // heading for the plot
  svg.append("g")
  .attr("transform", "translate("+ 225 +","+ (50) +")")
  .style("font-size", "15px")
  .append("text")
  .text("--Bar Pot text--") 

  // adding rectangle bars with transition, mouseover and mouseout
  g.selectAll(".bar")
  .data(plot_data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("fill", "white")
  .attr("x", function(d){ return xScale(d["key"]); })
  .attr("y", function(d){ return yScale(d["count"]); })
  .on("mouseover", onMouseOver)
  .on("mouseout", onMouseOut)
  .transition()
  .ease(d3.easeCubic)
  .duration(400)
  .attr("width", xScale.bandwidth())
  .attr("height", function(d){ return height - yScale(d["count"]) });

  function onMouseOver(d, i) {
    console.log(d,i)

    d3.selectAll(".bar").style("opacity", 0.4)
    d3.select(this).style("opacity", 1.0)
    d3.select(this).attr('class', 'highlight');
    d3.select(this)
    .transition()     // adds animation
    .duration(400)
    .attr('width', xScale.bandwidth() + 5)
    .attr("y", function(d) { return yScale(d["count"]) - 10; })
    .attr("height", function(d) { return height - yScale(d["count"]) + 10; });

    g.append("text")
    .attr('class', 'val') 
    .attr('x', function() {
        return xScale(d["key"]);
    })
    .attr('y', function() {
        return yScale(d["count"]) - 15;
    })
    .text(function() {
        return "Freq of " + d["key"]  + " = " + d["count"];  // Value of the text
    });
  }

  function onMouseOut(d, i) {
      // use the text label class to remove label on mouseout
      d3.selectAll(".bar").style("opacity", 1.0)
      d3.select(this).style("opacity", 1.0)
      d3.select(this).attr('class', 'bar');
      d3.select(this)
      .transition()     // adds animation
      .duration(400)
      .attr('width', xScale.bandwidth())
      .attr("y", function(d) { return yScale(d["count"]); })
      .attr("height", function(d) { return height - yScale(d["count"]); });

      d3.selectAll('.val')
      .remove()
  }
}
