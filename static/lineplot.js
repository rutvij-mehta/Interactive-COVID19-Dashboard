

function draw_line_plot(data, width, height, parallel_cords_data, color_country_mapping) {
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



  color_map_local = {}
  for (i in parallel_cords_data) {

    country_vector = par_data[i]
    country_code = country_vector['Country Code']
    color_map_local[country_code] = color_country_mapping(country_code)
  }
  console.log(color_map_local)

  console.log(data)
  // console.log("---------------------------")
  ylabel = "new_case"
  //plot_data = createDataLinePlot(data, dates, ylabel)
  plot_data = data
  // console.log("Input to drawLinesGraph", plot_data)
  drawLinesGraph(height, width, plot_data, ylabel, parallel_cords_data, color_map_local, color_country_mapping);


}


var drawLinesGraph = function (containerHeight, containerWidth, data, yLabel, parallel_cords_data, color_map_local, color_country_mapping) {
  var lineOpacity = "0.85";
  var lineOpacityHover = "1";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";

  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 3;
  var circleRadiusHover = 6;


  var svg = d3.select('#lineplot').append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight);

  var margin = { top: 45, left: 85, bottom: 45, right: 45 };

  var height = containerHeight - margin.top - margin.bottom;
  var width = containerWidth - margin.right - margin.left;



  // .attr('overflow', 'scroll');

  var minX = d3.min(data, function (d) { return d3.min(d, function (e) { return e[0] }) });
  var maxX = d3.max(data, function (d) { return d3.max(d, function (e) { return e[0] }) });
  var minY = d3.min(data, function (d) { return d3.min(d, function (e) { return e[1] }) });
  var maxY = d3.max(data, function (d) { return d3.max(d, function (e) { return e[1] }) });

  var ratio = height / width;

  var xScale = d3.scaleTime()
    .range([0, width])
    .domain([minX, maxX]);

  var yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([minY, maxY]);

  var line = d3.line()
    .x(function (d) { return xScale(d[0]); })
    .y(function (d) { return yScale(d[1]); })

  var line_d = d3.line()
    .x(function (d) { return xScale(d[0]); })
    .y(function (d) { return yScale(d[3]); })

  var line_r = d3.line()
    .x(function (d) { return xScale(d[0]); })
    .y(function (d) { return yScale(d[4]); })

  var colors = d3.scaleOrdinal()
    .domain([0, data.length])
    .range(d3.schemeCategory20);

  // colors = color_country_mapping
  // console.log(colors)

  var xAxis = d3.axisBottom(xScale),
    yAxis = d3.axisLeft(yScale);

  var brush = d3.brush().on("end", brushended),
    idleTimeout,
    idleDelay = 350;

  var drag = d3.drag().on('drag', dragged);

  svg.append("g")
    .attr("class", "brush")
    .call(brush);

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

  g.append('g')
    .attr('class', 'axis--x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis)
    .style('stroke', '#fff')
    .append('text')
    .attr('x', width / 2)
    .attr('y', 30)
    .attr('dy', '.1em')
    .attr('text-anchor', 'end')
    .attr('fill', 'rgb(54, 54, 54)')
    .attr('font-size', '1.2em')
    .text("Time ")
    ;

  g.append('g')
    .attr('class', 'axis--y')
    .call(yAxis)
    .style('stroke', '#fff')
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 10)
    .attr('dy', '.1em')
    .attr('text-anchor', 'end')
    .attr('fill', 'rgb(54, 54, 54)')
    .attr('font-size', '1.2em')
    .text("New Cases")

  g.append("g")
    .attr("class", "title")
    .attr('transform', 'translate(' + width / 1.75 + ', ' + 0 + ')')
    .append("text")
    .attr('y', 10)
    .attr('dy', '.1em')
    .attr('text-anchor', 'end')
    .attr('fill', 'rgb(256, 256, 256)')
    .text("Time Series")

  g.append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height);

  var main = g.append('g')
    .attr('class', 'main')
    .attr('clip-path', 'url(#clip)')
    .attr('id', 'main_in_lineplot')

  // console.log("---", data)
  for (let i = 0; i < data.length; i++) {
    main.append('path')
      .datum(data[i])
      .attr('id', mapping[i])
      .attr('d', line)
      .attr('stroke', function (d) { return color_map_local[d[0][2]] })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('class', 'line')



  }

  for (let i = 0; i < data.length; i++) {
    main.append('path')
      .datum(data[i])
      .attr('id', "deaths" + mapping[i])
      .attr('d', line_d)
      .attr('stroke', function (d) { return color_map_local[d[0][2]] })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('class', 'deaths')
      .style('opacity', '0')
      .style('stroke-dasharray', ("1,1"))



  }

  for (let i = 0; i < data.length; i++) {
    main.append('path')
      .datum(data[i])
      .attr('id', "recovered" + mapping[i])
      .attr('d', line_r)
      .attr('stroke', function (d) { return color_map_local[d[0][2]] })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('class', 'recovered')
      .style('opacity', '0')
      .style('stroke-dasharray', ("5,5"))



  }
  tooltip_data = {}
  for (i in par_data) {
    tooltip_data[par_data[i]['Country Code']] = par_data[i]
  }

  var barcolorScale = d3
    .scaleThreshold()
    .domain([10, 500, 5000, 10000, 20000, 30000, 50000, 500000])
    .range(d3.schemeBlues[9]);
  main.selectAll('.main path.line').on("mouseover", function (d, i) {

    var tooltip = d3.select("#lineplot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    tooltip
      .style("opacity", 1)
    tooltip
      .html("" + d[0][5])
      .style("left", (d3.mouse(this)[0] + 120) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")



    totalStats = d[d.length - 1]

    d3.selectAll('.line')
      .style('opacity', otherLinesOpacityHover);
    d3.selectAll('.circle')
      .style('opacity', circleOpacityOnLineHover);
    d3.select(this)
      .style('opacity', lineOpacityHover)
      .style("stroke-width", lineStrokeHover)
      .style("cursor", "pointer");

    var scatter = d3.select("#scatterplot").selectAll("circle")
    scatter.style('opacity', function (r) {

      if (d[0][2] == r['CountryCode']) {
        return 1

      }
      return 0.25

    })
      .attr('r', function (r) {
        if (d[0][2] == r['CountryCode']) {
          return 10
        }
        return 5
      })

    var map = d3.select("#choropleth").selectAll("path")
    map.style("opacity", function (r) {
      if (d[0][2] == r.id) {
        return 1
      }
      else {
        return 0.1
      }
    })


    current = d[0][2]
    bar_color = d3.select('#barchart').selectAll('rect').style('fill')

    d3.select('#barchart').selectAll('rect').style('fill', function (r) {
      // console.log(r)
      return r['Country Code'] == current ? color_map_local[current] : barcolorScale(r.TotalConfirmed);


    })

    var par = d3.select("#parallel")
    par.select("div").remove()
    parallel(par_data, $("#parallel").width(), $("#parallel").height(), [d[0][2]], color_country_mapping)

    par.selectAll(".axis .tick text").style("opacity", 1)

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

        return barcolorScale(r.TotalConfirmed);

      })

      var map = d3.select("#choropleth").selectAll("path").style('opacity', 0.85)

      d3.selectAll('.deaths').style("opacity", 0)
      d3.selectAll('.recovered').style("opacity", 0)

      tooltip = d3.selectAll(".tooltip")
      tooltip
        .remove()

      var scatter = d3.select("#scatterplot").selectAll("circle")
      scatter.style("opacity", 1)
      scatter.attr("r", 5)

      var par = d3.select("#parallel")
      par.select("div").remove()
      parallel(par_data, $("#parallel").width(), $("#parallel").height(), null, color_country_mapping)

    })



  function brushended() {

    var s = d3.event.selection;
    if (!s) {
      if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
      xScale.domain([minX, maxX]);
      yScale.domain([minY, maxY]);
      revertAllGraphs_LinePlot_Time(data, parallel_cords_data, color_country_mapping)
    } else {
      updateAllGraphs_LinePlot_Time(data, [s[0][0] * ratio, s[1][0]].map(xScale.invert, xScale), parallel_cords_data, color_country_mapping)
      xScale.domain([s[0][0] * ratio, s[1][0]].map(xScale.invert, xScale));
      yScale.domain([s[1][1], s[0][1] * ratio].map(yScale.invert, yScale));
      svg.select(".brush").call(brush.move, null);
    }
    zoom();
  }

  function idled() {
    idleTimeout = null;
  }

  function zoom() {
    var t = svg.transition().duration(750);
    svg.select(".axis--x").transition(t).call(xAxis);
    g.select(".axis--y").transition(t).call(yAxis);
    // g.selectAll(".circles").transition(t)
    //     .attr("cx", function(d) { return xScale(d[0]); })
    //     .attr("cy", function(d) { return yScale(d[1]); });
    g.selectAll(".line").transition(t)
      .attr("d", function (d) { return line(d); });

    g.selectAll(".deaths").transition(t)
      .attr("d", function (d) { return line_r(d); });

    g.selectAll(".recovered").transition(t)
      .attr("d", function (d) { return line_d(d); });


  }

  function dragged() {
    d3.selectAll('.line')
      .attr('transform', `translate(${d3.event.x}, ${d3.event.y})`);
    d3.selectAll('.line')
      .attr('transform', `translate(${d3.event.x}, ${d3.event.y})`);
    g.select(".axis--x").call(xAxis);
    g.select(".axis--y").call(yAxis);
  }

  // var legend_keys = ['new cases', 'new deaths', 'new recovered']
  // d3.select("#lineplot").select("svg").append("g").data(legend_keys).enter().attr("width", 10).attr("height", 10).style('fill', 'white')

  var t = d3.select("#lineplot svg")

  // Handmade legend

  t.append("text").attr("x", 160).attr("y", 85).text("__________  ").style("font-size", "10px").style("stroke", 'white').attr("alignment-baseline", "middle")
  t.append("text").attr("x", 160).attr("y", 115).text("....... ").style("font-size", "25px").style("stroke", 'white').attr("alignment-baseline", "middle")
  t.append("text").attr("x", 160).attr("y", 140).text("__   __   __   __ ").style("font-size", "10px").style("stroke", 'white').attr("alignment-baseline", "middle")

  t.append("text").attr("x", 220).attr("y", 90).text("new cases").style("font-size", "10px").style("stroke", 'white').attr("alignment-baseline", "middle")
  t.append("text").attr("x", 220).attr("y", 115).text("new recovered").style("font-size", "10px").style("stroke", 'white').attr("alignment-baseline", "middle")
  t.append("text").attr("x", 220).attr("y", 145).text("new deaths").style("font-size", "10px").style("stroke", 'white').attr("alignment-baseline", "middle")
}

function updateAllGraphs_LinePlot_Time(data, dates, parallel_cords_data, color_country_mapping) {
  start_date = dates[0]
  end_date = dates[1]
  new_data = {}
  new_data_map = d3.map()
  new_data_death = {}
  new_data_recovered = {}
  new_data_death_map = d3.map()
  new_data_recovered_map = d3.map()

  domain_data_cases = []
  domain_data_deaths = []
  domain_data_recovered = []
  var colorScale = d3
    .scaleThreshold()
    .domain([10, 500, 5000, 10000, 20000, 30000, 50000, 500000])
    .range(d3.schemeBlues[9]);


  i = 0
  data.forEach(function (d) {
    domain_data_cases[i] = 0
    domain_data_deaths[i] = 0
    domain_data_recovered[i] = 0

    d.forEach(function (r) {

      curr_date = r[0]
      curr_value = r[1]
      curr_country = d[0][2]
      curr_death = r[3]
      curr_recovered = r[4]
      domain_data_cases[i] += curr_value
      domain_data_deaths[i] += curr_death
      domain_data_recovered[i] += curr_recovered


      if (curr_date <= end_date && curr_date >= start_date) {
        if (curr_country in new_data) {

          new_data[curr_country] += curr_value
          new_data_death[curr_country] += curr_death
          new_data_recovered[curr_country] += curr_recovered
        }
        else {
          new_data[curr_country] = curr_value
          new_data_death[curr_country] = curr_death
          new_data_recovered[curr_country] = curr_recovered
        }

      }



    })
    i++
    new_data_map.set(curr_country, new_data[curr_country])
    new_data_death_map.set(curr_country, new_data_death[curr_country])
    new_data_recovered_map.set(curr_country, new_data_recovered[curr_country])

  })
  // console.log(data)
  // console.log(new_data_map)

  var map = d3.select("#choropleth").selectAll("path")
    .attr("fill", function (d) {

      d.total = new_data_map.get(d.id) || 0;
      return colorScale(d.total);
    })
  //Bar graph
  width = $("#barchart").width();
  height = $("#barchart").height();

  margin = { top: 25, right: 25, bottom: 25, left: 25 }

  var y = d3.scaleBand()
    .range([height - 4 * margin.top, 0])
    .padding(0);

  var xScale = d3.scaleLinear()
    .range([0, width - 2 * margin.left]);


  xScale.domain([0, d3.max(domain_data_cases)])




  var bar = d3.select("#barchart").selectAll("rect")
    .style("fill", function (d) {
      t = new_data_map.get(d['Country Code']) || 0;

      return colorScale(t);
    })
    .attr("width", function (d) {

      t = xScale(new_data_map.get(d['Country Code'])) || 0;


      return t

    })

  var temp_data = []

  temp_data = parallel_cords_data
  og = parallel_cords_data
  temp_data.forEach(function (d) {
    update_Case = new_data_map.get(d['Country Code'])
    update_Death = new_data_death_map.get(d['Country Code'])
    update_Recovered = new_data_recovered_map.get(d['Country Code'])
    d['Cases'] = update_Case
    d['Deaths'] = update_Death
    d['Recovered'] = update_Recovered
  })

  var par = d3.select('#parallel')
  par.select('div').remove()


  parallel(temp_data, $("#parallel").width(), height = $("#parallel").height(), null, color_country_mapping)

  //scatter

  scatter_data = []
  data.forEach(function (d) {
    temp = []
    d.forEach(function (r) {

      if (r[0] >= start_date && r[0] <= end_date)
        temp.push(r)

    })
    scatter_data.push(temp)
  })

  d3.select("#scatterplot").selectAll("svg").remove()
  draw_scatter(scatter_data, $("#scatterplot").width(), $("#scatterplot").height(), temp_data, 'Cases', 'Deaths', color_country_mapping)



}

function revertAllGraphs_LinePlot_Time(data, parallel_cords_data, color_country_mapping) {

  new_data = {}
  new_data_map = d3.map()

  new_data_death = {}
  new_data_recovered = {}
  new_data_death_map = d3.map()
  new_data_recovered_map = d3.map()

  var colorScale = d3
    .scaleThreshold()
    .domain([10, 500, 5000, 10000, 20000, 30000, 50000, 500000])
    .range(d3.schemeBlues[9]);
  // colorScale = color_country_mapping
  margin = { top: 25, right: 25, bottom: 25, left: 25 }
  j = 0
  data.forEach(function (d) {

    d.forEach(function (r) {



      curr_date = r[0]
      curr_value = r[1]
      curr_country = d[0][2]
      curr_death = r[3]
      curr_recovered = r[4]
      if (curr_country in new_data) {

        new_data[curr_country] += curr_value
        new_data_death[curr_country] += curr_death
        new_data_recovered[curr_country] += curr_recovered
      }
      else {
        new_data[curr_country] = curr_value
        new_data_death[curr_country] = curr_death
        new_data_recovered[curr_country] = curr_recovered
      }
    })

    new_data_map.set(curr_country, new_data[curr_country])
    new_data_death_map.set(curr_country, new_data_death[curr_country])
    new_data_recovered_map.set(curr_country, new_data_recovered[curr_country])

  })



  var map = d3.select("#choropleth").selectAll("path")
    .attr("fill", function (d) {


      d.total = new_data_map.get(d.id) || 0;
      //console.log(d)
      return colorScale(d.total);
    })

  var xScale = d3.scaleLinear()
    .range([0, width - 2 * margin.left]);


  xScale.domain([0, d3.max(Object.keys(new_data).map(function (key) {
    return new_data[key];
  }), function (d) {
    return d;
  })])




  var bar = d3.select("#barchart").selectAll("rect")
    .style("fill", function (d) {
      //console.log(d)
      t = new_data_map.get(d['Country Code']) || 0;

      return colorScale(t);
    })
    .attr("width", function (d) {

      t = xScale(new_data_map.get(d['Country Code'])) || 0;

      return t

    })
  temp_data = parallel_cords_data

  temp_data.forEach(function (d) {
    update_Case = new_data_map.get(d['Country Code'])
    update_Death = new_data_death_map.get(d['Country Code'])
    update_Recovered = new_data_recovered_map.get(d['Country Code'])
    d['Cases'] = update_Case
    d['Deaths'] = update_Death
    d['Recovered'] = update_Recovered
  })



  var par = d3.select('#parallel')
  par.select('div').remove()
  parallel(temp_data, $("#parallel").width(), $("#parallel").height(), null, color_country_mapping)


  d3.select("#scatterplot").selectAll("svg").remove()
  draw_scatter(data, $("#scatterplot").width(), $("#scatterplot").height(), parallel_cords_data, 'Cases', 'Deaths', color_country_mapping)

}



// // height2 = 
  // /* Scale */
  // var xScale = d3.scaleTime()
  //   .domain(d3.extent(data[0].values, d => d.date))
  //   .range([0, width - margin]);

  // var yScale = d3.scaleLinear()
  //   .domain([0, d3.max(max_cases)])
  //   .range([height - 4*margin, 0]);

  // // var xScale2 = d3.scaleTime()
  // //   .domain(d3.extent(data[0].values, d => d.date))
  // //   .range([0, width - margin]);

  // // var yScale2 = d3.scaleLinear()
  // //   .domain([0, d3.max(max_cases)])
  // //   .range([height, height - 4*margin]);


  // var color = d3.scaleOrdinal(d3.schemeCategory10);

  // /* Add SVG */
  // var svg = d3.select("#lineplot").append("svg")
  //   .attr("width", (width) + "px")
  //   .attr("height", (height) + "px")
  //   .append('g')
  //   .attr("transform", `translate(${margin / 1.5}, ${margin / 2})`);


  // /* Add Axis into SVG */
  // var xAxis = d3.axisBottom(xScale).ticks(5);
  // var yAxis = d3.axisLeft(yScale).ticks(5);

  // // var xAxis2 = d3.axisBottom(xScale2).ticks(5);
  // // var yAxis2 = d3.axisLeft(yScale2).ticks(5);

  // svg.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", `translate(0, ${height - 4*margin})`)
  //   .call(xAxis)
  //   .style('stroke', '#fff')
  //   .attr('fill', '#fff')

  // svg.append("g")
  //   .attr("class", "y axis")
  //   .call(yAxis)
  //   .style('stroke', '#fff')
  //   .attr('fill', '#fff')
  //   .append('text')
  //   .attr("y", 15)
  //   .attr("transform", "rotate(-90)")
  //   .style("stroke", "#fff")
  //   .text("Total values");

  // // svg.append("g")
  // //   .attr("class", "x axis")
  // //   .attr("transform", `translate(0, ${height})`)
  // //   .call(xAxis2)
  // //   .style('stroke', '#fff')
  // //   .attr('fill', '#fff')

  // // svg.append("g")
  // //   .attr("class", "y axis")
  // //   .call(yAxis2)
  // //   .style('stroke', '#fff')
  // //   .attr('fill', '#fff')
  // //   .append('text')
  // //   .attr("y", 15)
  // //   .attr("transform", "rotate(-90)")
  // //   .style("stroke", "#fff")
  // //   .text("Total values");

  // /* Add line into SVG */
  // var line = d3.line()
  //   .x(d => xScale(d.date))
  //   .y(d => yScale(d.new_case));

  // // var line2 = d3.line()
  // //   .x(d => xScale2(d.date))
  // //   .y(d => yScale2(d.new_case)); 

  // svg.append("defs").append("clipPath").attr("id", "clip").append("rect")
  //     .attr("width", width).attr("height", height);

  // let lines = svg.append('g')
  //   .attr('class', 'lines');

  // lines.selectAll('.line-group')
  //   .data(data).enter()
  //   .append('g')
  //   .attr('class', 'line-group')
  //   // .on("mouseover", function (d, i) {

  //   //   svg.append("text")
  //   //     .attr("class", "title-text")
  //   //     .style("fill", color(i))
  //   //     .text(d.name + " Total cases: " + d.total_confirmed)
  //   //     .attr("text-anchor", "middle")
  //   //     .attr("x", (width - margin) / 2)
  //   //     .attr("y", 5);
  //   // })
  //   // .on("mouseout", function (d) {
  //   //   svg.select(".title-text").remove();
  //   // })
  //   .append('path')
  //   .attr('class', 'line')
  //   .attr('d', d => line(d.values))
  //   .style('stroke', (d, i) => color(i))
  //   .style('opacity', lineOpacity)
  //   .attr('id', function (d) {
  //     return d.CountryCode
  //   });
  //   // .on("mouseover", function (d) {
  //   //   d3.selectAll('.line')
  //   //     .style('opacity', otherLinesOpacityHover);
  //   //   d3.selectAll('.circle')
  //   //     .style('opacity', circleOpacityOnLineHover);
  //   //   d3.select(this)
  //   //     .style('opacity', lineOpacityHover)
  //   //     .style("stroke-width", lineStrokeHover)
  //   //     .style("cursor", "pointer");

  //   //   current = d.CountryCode
  //   //   bar_color = d3.select('#barchart').selectAll('rect').style('fill')

  //   //   d3.select('#barchart').selectAll('rect').style('fill', function (r) {

  //   //     return r['Country Code'] == current ? "red" : d3.select(this).style('fill');

  //   //   })
  //   // })
  //   // .on("mouseout", function (d) {
  //   //   d3.selectAll(".line")
  //   //     .style('opacity', lineOpacity);
  //   //   d3.selectAll('.circle')
  //   //     .style('opacity', circleOpacity);
  //   //   d3.select(this)
  //   //     .style("stroke-width", lineStroke)
  //   //     .style("cursor", "none");

  //   //   d3.select('#barchart').selectAll('rect').style('fill', function (r) {

  //   //     return bar_color;

  //   //   })
  //   // });