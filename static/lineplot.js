
function draw_line_plot(data, width, height, dates) {

  ylabel = "new_case"



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


  plot_data = []
  mapping = {}
  console.log(data)
  for (i = 0; i < data.length; i++) {
    last_val = data[i]["values"].pop()
    val = data[i]["values"]
    country_code = data[i]["CountryCode"]
    mapping[i] = country_code
    plot_val = []


    for (j = 0; j < val.length; j++) {
      date = val[j]["date"]
      cases = val[j][ylabel]
      deaths = val[j]['deaths']
      recovered = val[j['recovered']]
      if (isNaN(cases) || cases < 0)
        cases = 0
      if (isNaN(deaths) || deaths < 0)
        deaths = 0

      if (isNaN(recovered) || recovered < 0)
        recovered = 0

      plot_val.push([date, cases, country_code, deaths, recovered])
    }
    plot_data.push(plot_val)
  }



  drawLinesGraph(height, width, plot_data, ylabel);

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




}

var drawLinesGraph = function (containerHeight, containerWidth, data, yLabel) {


  var svg = d3.select('#lineplot').append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight);

  var margin = { top: 45, left: 85, bottom: 45, right: 45 };

  var height = containerHeight - margin.top - margin.bottom;
  var width = containerWidth - margin.right - margin.left;

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
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
    .y(function (d) { return yScale(d[1]); });

  var colors = d3.scaleOrdinal()
    .domain([0, data.length])
    .range(d3.schemeCategory20);

  var xAxis = d3.axisBottom(xScale),
    yAxis = d3.axisLeft(yScale);

  var brush = d3.brush().on("end", brushended),
    idleTimeout,
    idleDelay = 350;

  var drag = d3.drag().on('drag', dragged);

  svg.append("g")
    .attr("class", "brush")
    .call(brush);

  g.append('g')
    .attr('class', 'axis--x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis)
    .style('stroke', '#fff');

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
    .text(yLabel)

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

  for (let i = 0; i < data.length; i++) {
    main.append('path')
      .datum(data[i])
      .attr('id', mapping[i])
      .attr('d', line)
      .attr('stroke', d => colors(i))
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('class', 'line');
  }

  function brushended() {
    var s = d3.event.selection;
    if (!s) {
      if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
      xScale.domain([minX, maxX]);
      yScale.domain([minY, maxY]);
      revertAllGraphs_LinePlot_Time(data)
    } else {
      updateAllGraphs_LinePlot_Time(data, [s[0][0] * ratio, s[1][0]].map(xScale.invert, xScale))
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

  }

  function dragged() {
    d3.selectAll('.line')
      .attr('transform', `translate(${d3.event.x}, ${d3.event.y})`);
    d3.selectAll('.line')
      .attr('transform', `translate(${d3.event.x}, ${d3.event.y})`);
    g.select(".axis--x").call(xAxis);
    g.select(".axis--y").call(yAxis);
  }
}

function updateAllGraphs_LinePlot_Time(data, dates) {
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
    new_data_death_map.set(curr_country, new_data[curr_country])
    new_data_recovered_map.set(curr_country, new_data[curr_country])

  })


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





}

function revertAllGraphs_LinePlot_Time(data) {
  new_data = {}
  new_data_map = d3.map()
  var colorScale = d3
    .scaleThreshold()
    .domain([10, 500, 5000, 10000, 20000, 30000, 50000, 500000])
    .range(d3.schemeBlues[9]);

  margin = { top: 25, right: 25, bottom: 25, left: 25 }

  data.forEach(function (d) {

    d.forEach(function (r) {

      curr_date = r[0]
      curr_value = r[1]
      curr_country = d[0][2]
      curr_death = r[3]
      curr_recovered = r[4]
      if (curr_country in new_data) {

        new_data[curr_country] += curr_value
      }
      else {
        new_data[curr_country] = curr_value
      }
    })
    new_data_map.set(curr_country, new_data[curr_country])

  })

  var map = d3.select("#choropleth").selectAll("path")
    .attr("fill", function (d) {

      d.total = new_data_map.get(d.id) || 0;
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
      t = new_data_map.get(d['Country Code']) || 0;

      return colorScale(t);
    })
    .attr("width", function (d) {

      t = xScale(new_data_map.get(d['Country Code'])) || 0;

      return t

    })




}