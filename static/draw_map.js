// The svg
function draw_map(cv_data, map, width, height, timeseries, dates, par_data, color_country_mapping) {
  margin = 50
  var initX;
  var mouseClicked = false;
  var s = 1;
  var rotated = 0;
  ylabel_index = 1

  // createDataLinePlot(timeseries, dates, "new_case")

  // plot_data = createDataMap(timeseries, dates, "new_case")

  var data = d3.map();
  var colorScale = d3
    .scaleThreshold()
    .domain([10, 500, 5000, 10000, 20000, 30000, 50000, 500000])
    .range(d3.schemeBlues[9]);

  color_map_local = {}
  for (i in par_data) {

    country_vector = par_data[i]
    country_code = country_vector['Country Code']
    color_map_local[country_code] = color_country_mapping(country_code)
  }

  // plot_data to input of map data
  country_code_confirmed = {}
  tooltip_data = {}
  for (i in cv_data) {
    country_list = cv_data[i]
    country_code = country_list[0][2]
    country_cases = d3.sum(country_list, function (d) { return d[ylabel_index] })
    data.set(country_code, +country_cases);



  }

  for (i in par_data) {
    tooltip_data[par_data[i]['Country Code']] = par_data[i]
  }


  //need to store this because on zoom end, using mousewheel, mouse position is NAN
  var mouse;

  const projection = d3
    .geoMercator()
    .center([0, 40])
    .translate([width / 2, height / 2])
    .scale((width - 1) / 2 / Math.PI);
  var path = d3.geoPath().projection(projection);

  const zoom = d3
    .zoom()
    .scaleExtent([-10, 10])
    .on("zoom", zoomed)
    .on("end", zoomended);

  const svg = d3
    .select("#choropleth")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", function () {
      if (s !== 1) return;
      initX = d3.mouse(this)[0];
      mouseClicked = true;
    });

  const g = svg.append("g");

  var x = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "scale(0.7) translate(30,450)")
    .attr("width", 100)
    .attr("height", 100);

  x.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -5)
    .text("Total Confirmed");
  var labels = ["10-499", "500-4999", "5000-9999", "10K-19K", "20K-29K", "30K-49K", "50K-499K", "500K-1M", "1M +"];
  var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
  svg.select(".legendThreshold")
    .call(legend);
  svg.call(zoom);

  x.selectAll("text").style("fill", 'white')



  function zoomended() {
    if (s !== 1) return;
    rotated = rotated + ((mouse[0] - initX) * 360) / (s * width);
    mouseClicked = false;
  }


  function zoomed() {
    var t = [d3.event.transform.x, d3.event.transform.y];
    s = d3.event.transform.k;
    var h = 0;

    t[0] = Math.min(
      (width / height) * (s - 1),
      Math.max(width * (1 - s), t[0])
    );

    t[1] = Math.min(
      h * (s - 1) + h * s,
      Math.max(height * (1 - s) - h * s, t[1])
    );

    g.selectAll("path") // To prevent stroke width from scaling
      .attr("transform", d3.event.transform);
  }
  var lp = d3.select('#lineplot')

  var mouseover1 = function (d) {

  }



  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave1 = function (d) {
    tooltip = d3.selectAll(".tooltip")
    tooltip
      .remove()
  }
  let mouseOver = function (d, i) {
    q = {}
    tt_data = tooltip_data[d.id]
    if (tt_data == null) {
      tooltip_data[d.id] = { 'Deaths': 0, 'Recovered': 0 }


    }

    var tooltip1 = d3.select("#choropleth")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    tooltip1
      .style("opacity", 1)

    tooltip1
      .html("" + d.properties.name + "<br>Cases: " + d.total + "<br>Deaths: " + tooltip_data[d.id]['Deaths'] + "<br>Recovered: " + tooltip_data[d.id]['Recovered'])
      .style("left", (d3.mouse(this)[0] + 50) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")





    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.1);
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    d3.select(this).transition().duration(200).style("opacity", 1);
    x1 = d3.mouse(this)[0];
    y1 = d3.mouse(this)[1];
    tag = d.id


    name = d.properties.name
    total = d.total
    var color1
    lp.selectAll('.line').style('opacity', function (r, j) {

      if (r[0][2] == tag)
        color1 = d3.select(this).style('stroke')

      return r[0][2] == tag ? 1 : 0;
    });

    lp.selectAll('.recovered').style('opacity', function (r, j) {

      if (r[0][2] == tag)
        color1 = d3.select(this).style('stroke')

      return r[0][2] == tag ? 1 : 0;
    });

    lp.selectAll('.deaths').style('opacity', function (r, j) {

      if (r[0][2] == tag)
        color1 = d3.select(this).style('stroke')

      return r[0][2] == tag ? 1 : 0;
    });

    current = tag
    bar_color = d3.select('#barchart').selectAll('rect').style('fill')

    d3.select('#barchart').selectAll('rect').style('fill', function (r) {

      return r['Country Code'] == current ? color_map_local[current] : barcolorScale(r.TotalConfirmed);

    })


    // lp.select('#lineplot .main').append("text")
    //   .attr("class", "title-text")
    //   .style("fill", color1)
    //   .text(name)
    //   .attr("text-anchor", "middle")
    //   .attr("x", (width - 100) / 2)
    //   .attr("y", 50);


    //parallel


    var par = d3.select("#parallel")
    par.select("div").remove()
    parallel(par_data, $("#parallel").width(), $("#parallel").height(), [tag], color_country_mapping)

    par.selectAll(".axis .tick text").style("opacity", 1)


    var scatter = d3.select("#scatterplot").selectAll("circle")
    scatter.style('opacity', function (r) {

      if (tag == r['CountryCode']) {
        return 1

      }
      return 0.25

    })
      .attr('r', function (r) {
        if (tag == r['CountryCode']) {
          return 10
        }
        return 5
      })

    // svg.append("g").attr("class", "databox").attr("transform", "scale(0.7) translate(" + (width - 50) + "," + (height + 100) + ")").attr("width", 100).attr("height", 100)

    //   .append("text").attr("class", "Databox_text").text(function () {
    //     name = d.properties.name
    //     total_conf = d.total
    //     return name + " total cases:" + total_conf

    //   })



  };

  let mouseLeave = function (d) {

    tooltip = d3.selectAll(".tooltip")
    tooltip
      .remove()

    d3.select("#choropleth .databox").remove()
    d3.select("#number_textbox").remove();
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.85);
    d3.select(this).transition().duration(200).style("stroke", "transparent");
    // tip.hide();
    lp.selectAll('path').style('opacity', 0.85);
    lp.selectAll('.deaths').style("opacity", 0)
    d3.selectAll('.recovered').style("opacity", 0)
    lp.select(".title-text").remove();

    d3.select('#barchart').selectAll('rect').style('fill', function (r) {

      return barcolorScale(r.TotalConfirmed);

    })


    var par = d3.select("#parallel")
    par.select("div").remove()
    parallel(par_data, $("#parallel").width(), $("#parallel").height(), null, color_country_mapping)

    par.selectAll(".axis .tick text").style("opacity", 0)

    var scatter = d3.select("#scatterplot").selectAll("circle")
    scatter.style("opacity", 1)
    scatter.attr("r", 5)


  };
  var barcolorScale = d3
    .scaleThreshold()
    .domain([10, 500, 5000, 10000, 20000, 30000, 50000, 500000])
    .range(d3.schemeBlues[9]);

  let onClick = function (d) {
    if (d.id == 'USA')
      draw_us(us_data, height, width, us)
  }

  g.append("g")
    .attr("class", "boundary")
    .selectAll("boundary")
    .data(map.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })
    .style("stroke", "transparent")
    .attr("class", function (d) {
      return "Country";
    })
    .style("opacity", 0.8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("click", onClick);

}
