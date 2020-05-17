
function draw_line_plot(data, width, height, dates) {



  var margin = 70;
  var duration = 250;

  var lineOpacity = "0.85";
  var lineOpacityHover = "1";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";

  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 3;
  var circleRadiusHover = 6;

  max_cases = []
  /* Format Data */
  var parseDate = d3.timeParse("%Y-%m-%d");
  temp_data = []
  keys = d3.keys(data)


  for (var i = 0; i < keys.length; i++) {
    var name = keys[i];
    var value = data[name];
    var cc = value.pop()
    var code = cc['CountryCode']
    c = [value[0]['confirmed']]
    d = [value[0]['deaths']]
    r = [value[0]['recovered']]
    value[0]['new_case'] = c[0]
    value[0]['new_death'] = d[0]
    value[0]['new_recovered'] = r[0]
    for (var j = 1; j < dates.length - 1; j++) {
      c[j] = value[j]['confirmed'] - value[j - 1]['confirmed']
      d[j] = value[j]['deaths'] - value[j - 1]['deaths']
      r[j] = value[j]['recovered'] - value[j - 1]['recovered']
      value[j]['new_case'] = c[j]
      value[j]['new_death'] = d[j]
      value[j]['new_recovered'] = r[j]
    }
    max_cases[i] = d3.max(c)
    var total_confirmed = d3.max(value, d => d.confirmed)

    var total_death = d3.max(value, d => d.deaths)
    var total_recovered = d3.max(value, d => d.recovered)

    temp_data[i] = { 'name': name, 'values': value, 'total_confirmed': total_confirmed, 'total_death': total_death, 'total_recovered': total_recovered, 'CountryCode': code }

  }
  data = temp_data

  console.log(data)

  data.forEach(function (d) {
    d.values.forEach(function (d) {
      d.date = parseDate(d.date);
      d.confirmed = +d.confirmed;
      d.deaths = +d.deaths;
      d.recovered = +d.recovered;
      d.new_case = +d.new_case;
      d.new_recovered = +d.new_recovered;
      d.new_death = +d.new_death;
    });
  });


  /* Scale */
  var xScale = d3.scaleTime()
    .domain(d3.extent(data[0].values, d => d.date))
    .range([0, width - margin]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(max_cases)])
    .range([height - margin, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  /* Add SVG */
  var svg = d3.select("#lineplot").append("svg")
    .attr("width", (width) + "px")
    .attr("height", (height) + "px")
    .append('g')
    .attr("transform", `translate(${margin / 1.5}, ${margin / 2})`);


  /* Add line into SVG */
  var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.new_case));

  let lines = svg.append('g')
    .attr('class', 'lines');

  lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')
    .on("mouseover", function (d, i) {

      svg.append("text")
        .attr("class", "title-text")
        .style("fill", color(i))
        .text(d.name + " Total cases: " + d.total_confirmed)
        .attr("text-anchor", "middle")
        .attr("x", (width - margin) / 2)
        .attr("y", 5);
    })
    .on("mouseout", function (d) {
      svg.select(".title-text").remove();
    })
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', lineOpacity)
    .attr('id', function (d) {
      return d.CountryCode
    })
    .on("mouseover", function (d) {
      d3.selectAll('.line')
        .style('opacity', otherLinesOpacityHover);
      d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);
      d3.select(this)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");

      current = d.CountryCode
      bar_color = d3.select('#barchart').selectAll('rect').style('fill')

      d3.select('#barchart').selectAll('rect').style('fill', function (r) {

        return r['Country Code'] == current ? "red" : d3.select(this).style('fill');

      })
    })
    .on("mouseout", function (d) {
      d3.selectAll(".line")
        .style('opacity', lineOpacity);
      d3.selectAll('.circle')
        .style('opacity', circleOpacity);
      d3.select(this)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");

      d3.select('#barchart').selectAll('rect').style('fill', function (r) {

        return bar_color;

      })
    });





  /* Add circles in the line */
  // lines.selectAll("circle-group")
  //   .data(data).enter()
  //   .append("g")
  //   .style("fill", (d, i) => color(i))
  //   .selectAll("circle")
  //   .data(d => d.values).enter()
  //   .append("g")
  //   .attr("class", "circle")
  //   .on("mouseover", function (d) {
  //     d3.select(this)
  //       .style("cursor", "pointer")
  //       .append("text")
  //       .attr("class", "text")
  //       .text(`${d.confirmed}`)
  //       .attr("x", d => xScale(d.date) + 5)
  //       .attr("y", d => yScale(d.confirmed) - 10);
  //   })
  //   .on("mouseout", function (d) {
  //     d3.select(this)
  //       .style("cursor", "none")
  //       .transition()
  //       .duration(duration)
  //       .selectAll(".text").remove();
  //   })
  //   .append("circle")
  //   .attr("cx", d => xScale(d.date))
  //   .attr("cy", d => yScale(d.confirmed))
  //   .attr("r", circleRadius)
  //   .style('opacity', circleOpacity)
  //   .on("mouseover", function (d) {
  //     d3.select(this)
  //       .transition()
  //       .duration(duration)
  //       .attr("r", circleRadiusHover);
  //   })
  //   .on("mouseout", function (d) {
  //     d3.select(this)
  //       .transition()
  //       .duration(duration)
  //       .attr("r", circleRadius);
  //   });


  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(xAxis)
    .style('stroke', '#fff')
    .attr('fill', '#fff')

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .style('stroke', '#fff')
    .attr('fill', '#fff')
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .style("stroke", "#fff")
    .text("Total values");

}


// function draw_line_plot(data, width, height) {
//   var margin = { top: 10, right: 30, bottom: 30, left: 60 },
//     width = width - margin.left - margin.right,
//     height = height - margin.top - margin.bottom;

//   var parseTime = d3.timeParse("%Y%m%d"),
//     formatDate = d3.timeFormat("%Y-%m-%d"),
//     bisectDate = d3.bisector((d) => d.date).left,
//     formatValue = d3.format(",.0f");
//   console.log(data);
//   // append the svg object to the body of the page
//   var svg = d3
//     .select("#lineplot")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   for (var i = 0; i < data.length; i++) {
//     data.date = parseTime(data.date);
//     data.confirmed = Integer.parseInt(data.confirmed);
//     data.deaths = Integer.parseInt(data.deaths);
//     data.recovered = Integer.parseInt(data.recovered);
//   }
//   var x = d3
//     .scaleTime()
//     .rangeRound([margin.left, width - margin.right])
//     .domain(d3.extent(data, (d) => d.date));

//   var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

//   var z = d3.scaleOrdinal(d3.schemeCategory10);

//   var line_Confirmed = d3
//     .line()
//     .curve(d3.curveCardinal)
//     .x((d) => x(d.date))
//     .y((d) => y(d.confirmed));
//   svg
//     .append("g")
//     .attr("class", "x-axis")
//     .attr("transform", "translate(0," + (height - margin.bottom) + ")")
//     .style("border-color", "red")
//     .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));

//   svg
//     .append("g")
//     .attr("class", "y-axis")
//     .attr("transform", "translate(" + margin.left + ",0)");

//   var focus = svg.append("g").attr("class", "focus").style("display", "none");

//   focus
//     .append("line")
//     .attr("class", "lineHover")
//     .style("stroke", "#999")
//     .attr("stroke-width", 1)
//     .style("shape-rendering", "crispEdges")
//     .style("opacity", 0.5)
//     .attr("y1", -height)
//     .attr("y2", 0);

//   focus
//     .append("text")
//     .attr("class", "lineHoverDate")
//     .attr("text-anchor", "middle")
//     .attr("font-size", 12);

//   var overlay = svg
//     .append("rect")
//     .attr("class", "overlay")
//     .attr("x", margin.left)
//     .attr("width", width - margin.right - margin.left)
//     .attr("height", height);
//   keys = d3.keys(data);
//   update(d3.select("#selectbox").property("values"), 0);

//   function update(input, speed) {
//     var countries = data.map(function (id) {
//       return {
//         id: id,
//         values: data.map((d) => {
//           return { date: d.date, value: +d[input] };
//         }),
//       };
//     });
//   }

//   //     y.domain([
//   //       d3.min(cities, (d) => d3.min(d.values, (c) => c.degrees)),
//   //       d3.max(cities, (d) => d3.max(d.values, (c) => c.degrees)),
//   //     ]).nice();

//   //     svg
//   //       .selectAll(".y-axis")
//   //       .transition()
//   //       .duration(speed)
//   //       .call(d3.axisLeft(y).tickSize(-width + margin.right + margin.left));

//   //     var city = svg.selectAll(".cities").data(cities);

//   //     city.exit().remove();

//   //     city
//   //       .enter()
//   //       .insert("g", ".focus")
//   //       .append("path")
//   //       .attr("class", "line cities")
//   //       .style("stroke", (d) => z(d.id))
//   //       .merge(city)
//   //       .transition()
//   //       .duration(speed)
//   //       .attr("d", (d) => line(d.values));

//   //     tooltip(copy);
//   //   }

//   //   function tooltip(copy) {
//   //     var labels = focus.selectAll(".lineHoverText").data(copy);

//   //     labels
//   //       .enter()
//   //       .append("text")
//   //       .attr("class", "lineHoverText")
//   //       .style("fill", (d) => z(d))
//   //       .attr("text-anchor", "start")
//   //       .attr("font-size", 12)
//   //       .attr("dy", (_, i) => 1 + i * 2 + "em")
//   //       .merge(labels);

//   //     var circles = focus.selectAll(".hoverCircle").data(copy);

//   //     circles
//   //       .enter()
//   //       .append("circle")
//   //       .attr("class", "hoverCircle")
//   //       .style("fill", (d) => z(d))
//   //       .attr("r", 2.5)
//   //       .merge(circles);

//   //     svg
//   //       .selectAll(".overlay")
//   //       .on("mouseover", function () {
//   //         focus.style("display", null);
//   //       })
//   //       .on("mouseout", function () {
//   //         focus.style("display", "none");
//   //       })
//   //       .on("mousemove", mousemove);

//   //     function mousemove() {
//   //       var x0 = x.invert(d3.mouse(this)[0]),
//   //         i = bisectDate(data, x0, 1),
//   //         d0 = data[i - 1],
//   //         d1 = data[i],
//   //         d = x0 - d0.date > d1.date - x0 ? d1 : d0;

//   //       focus
//   //         .select(".lineHover")
//   //         .attr("transform", "translate(" + x(d.date) + "," + height + ")");

//   //       focus
//   //         .select(".lineHoverDate")
//   //         .attr(
//   //           "transform",
//   //           "translate(" + x(d.date) + "," + (height + margin.bottom) + ")"
//   //         )
//   //         .text(formatDate(d.date));

//   //       focus
//   //         .selectAll(".hoverCircle")
//   //         .attr("cy", (e) => y(d[e]))
//   //         .attr("cx", x(d.date));

//   //       focus
//   //         .selectAll(".lineHoverText")
//   //         .attr("transform", "translate(" + x(d.date) + "," + height / 2.5 + ")")
//   //         .text((e) => e + " " + "º" + formatValue(d[e]));

//   //       x(d.date) > width - width / 4
//   //         ? focus
//   //             .selectAll("text.lineHoverText")
//   //             .attr("text-anchor", "end")
//   //             .attr("dx", -10)
//   //         : focus
//   //             .selectAll("text.lineHoverText")
//   //             .attr("text-anchor", "start")
//   //             .attr("dx", 10);
//   //     }
//   //   }

//   //   var selectbox = d3.select("#selectbox").on("change", function () {
//   //     update(this.value, 750);
//   //   });
// }