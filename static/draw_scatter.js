
function draw_scatter(cv_data, containerWidth, containerHeight, par_data, X_label, Y_label) {

  console.log(par_data)
  // X_label = "Cases"
  // Y_label = "Deaths"

  country_code_confirmed = []
  // for (i in cv_data) {
  //   country_list = cv_data[i]
  //   country_code = country_list[0][2]
  //   country_name = country_list[0][5]
  //   country_cases = d3.sum(country_list, function (d) { return d[ylabel_index] })
  //   country_deaths = d3.sum(country_list, function (d) { return d[3] })
  //   if (isNaN(country_cases) || isNaN(country_deaths)) {
  //     continue
  //   }
  //   country_code_confirmed.push({ "CountryCode": country_code, "dx": country_cases, "dy": country_deaths, "CountryName": country_name })
  // }
  country_code_confirmed = []
  for (i in par_data) {

    country_vector = par_data[i]
    country_code = country_vector['Country Code']
    X = country_vector[X_label]
    Y = country_vector[Y_label]
    country_name = country_vector['Country']
    country_code_confirmed.push({ "CountryCode": country_code, "dx": X, "dy": Y, "CountryName": country_name })
  }




  var svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight);

  var margin = { top: 45, left: 85, bottom: 45, right: 45 };

  var height = containerHeight - margin.top - margin.bottom;
  var width = containerWidth - margin.right - margin.left;

  var xScale = d3.scaleLinear().range([0, width]),
    yScale = d3.scaleLinear().range([height, 0]);

  xScale.domain([d3.min(country_code_confirmed, function (d) { return d["dx"] }), d3.max(country_code_confirmed, function (d) { return d["dx"] })]);
  yScale.domain([d3.min(country_code_confirmed, function (d) { return d["dy"] }), d3.max(country_code_confirmed, function (d) { return d["dy"] })]);


  var xAxis = d3.axisBottom(xScale)
  // .tickFormat(formatIncome),
  yAxis = d3.axisLeft(yScale)
  // .tickFormat(formatHsGradAxis);

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

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
    .text("y label input here")

  d3.select("#axis--x")
    .append("text")
    // .attr("transform", "translate(360, -10)")
    .text("dx");

  d3.select("#axis--y")
    .append("text")
    .attr("transform", "rotate(-90) translate(-20, 15)")
    .text("dy");

  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var circles = g.append("g")
    .selectAll("circle")
    .data(country_code_confirmed)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("id", function (d) { return d["CountryCode"] })
    .attr("cx", function (d) { return xScale(d["dx"]) })
    .attr("cy", function (d) { return yScale(d["dy"]) })
    .style("fill", function (d) { return color(d["CountryCode"]) })
    .style("fill-opacity", "0.5");
  // .attr("class", "non_brushed");

  idleTimeout1 = 100
  var brush = d3.brush()
    // .on("brush", highlightBrushedCircles)
    .on("end", brushend_scatter)
  idleTimeout1,
    idleDelay = 100;

  svg.append("g")
    .call(brush);

  function brushend_scatter() {
    var s = d3.event.selection;
    if (!s) {
      if (!idleTimeout1) return idleTimeout1 = setTimeout(idled, idleDelay);
      revertAllGraphs_ScatterPlot(cv_data, par_data)
    } else {

      circles.style("fill-opacity", "0.5");
      var brush_coords = d3.brushSelection(this);

      // style brushed circles
      cnt_list = []
      circles.filter(function () {
        var cx = d3.select(this).attr("cx"),
          cy = d3.select(this).attr("cy");

        if (isBrushed(brush_coords, cx, cy)) {
          cnt_list.push(d3.select(this).attr("id"))
          // console.log(d3.select(this).attr("id"))
        }
        return isBrushed(brush_coords, cx, cy);
      })
        .style("fill-opacity", "1")
      updateAllGraphs_ScatterPlot(cv_data, cnt_list, par_data);
      svg.select(".brush").call(brush.move, null);
    }
  }

  function isBrushed(brush_coords, cx, cy) {

    var x0 = brush_coords[0][0] - margin.left,
      x1 = brush_coords[1][0] - margin.left,
      y0 = brush_coords[0][1] - margin.top,
      y1 = brush_coords[1][1] - margin.top;

    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  }

  function idled() {
    idleTimeout1 = null;
  }

}

function updateAllGraphs_ScatterPlot(cv_data, cnt_list, par_data) {

  var line = d3.select("#lineplot").selectAll(".line").style('opacity', function (r, j) {

    if (cnt_list.includes(r[0][2])) {
      color1 = d3.select(this).style('stroke')
      return 1
    }
    return 0

  });


  var bar = d3.select("#barchart").selectAll("rect").style("opacity", function (r) {

    if (cnt_list.includes(r['Country Code']))
      return 1
    else
      return 0
  })




  //map

  var map = d3.select("#choropleth").selectAll("path")
    .style("opacity", function (d) {


      if (cnt_list.includes(d.id))
        return 1
      else
        return 0.1

    })

  //parallel

  var par = d3.select("#parallel")
  par.select("div").remove()
  console.log('CNT_LIST ', cnt_list)
  console.log("PAR data inside scatter", par_data)
  parallel(par_data, $('#parallel').width(), $('#parallel').height(), cnt_list)

}

function revertAllGraphs_ScatterPlot(cv_data, par_data) {

  d3.selectAll('circle').style("fill-opacity", "0.5")

  //lineplot
  d3.select("#lineplot").selectAll(".line").style("opacity", 1)

  //barchart
  d3.select("#barchart").selectAll("rect").style("opacity", 1)

  //map 
  var map = d3.select("#choropleth").selectAll("path")
    .style("opacity", function (d) {
      return 1
    })
  var par = d3.select("#parallel")
  par.select("div").remove()
  console.log('CNT_LIST ', cnt_list)
  console.log("PAR data inside scatter", par_data)
  parallel(par_data, $('#parallel').width(), $('#parallel').height(), null)

}
