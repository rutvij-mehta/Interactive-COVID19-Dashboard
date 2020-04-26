/* old_chart = d3.select("#choropleth").selectAll("svg").remove();
  var svg = d3.select("#choropleth").append("svg");
  var rotate = 60;
  svg.attr("width", width).attr("height", height);

  // Map and projection
  var path = d3.geoPath();
  var projection = d3
    .geoMercator()
    .rotate([0, 0])
    .scale(zoom / 2 / Math.PI)
    .center([c1, c2])
    .translate([x / 2, y / 2]);

  // Data and color scale
  var data = d3.map();
  var colorScale = d3
    .scaleThreshold()
    .domain([10, 100, 1000, 3000, 10000, 50000])
    .range(d3.schemeBlues[7]);
  // Load external data and boot

  for (i = 0; i < cv_data.length; i++) {
    data.set(cv_data[i]["Country Code"], +cv_data[i]["TotalConfirmed"]);
  }

  ready(map);
  function ready(topo) {
    let mouseOver = function (d) {
      d3.selectAll(".Country").transition().duration(200).style("opacity", 0.5);
      d3.select(this).transition().duration(200).style("opacity", 1);
    };

    let mouseLeave = function (d) {
      d3.selectAll(".Country").transition().duration(200).style("opacity", 0.8);
      d3.select(this).transition().duration(200).style("stroke", "transparent");
    };
    // Draw the map
    svg
      .append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      // draw each country
      .attr("d", d3.geoPath().projection(projection))
      // set the color of each country
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
      .on("mouseleave", mouseLeave);
  }
  dx = 0;
  dy = 0;
  d3.selectAll("#choropleth")
    .on("mousedown", function () {
      x_old = d3.mouse(this)[0];
      y_old = d3.mouse(this)[1];
    })
    .on("mouseup", function () {
      x_new = d3.mouse(this)[0];
      y_new = d3.mouse(this)[1];
      dx = x_new - x_old;
      dy = y_new - y_old;
      draw_map(cv_data, map, width, height, x + dx, y + dy, zoom, c1, c2);
    })
    .on("dblclick", function () {
      c1 = d3.mouse(this)[0];
      c2 = d3.mouse(this)[1];
      console.log(c1, c2);
      zoom = zoom * 1.1;
      console.log(zoom);
      draw_map(cv_data, map, width, height, x + dx, y + dy, zoom, c1, c2);
    });
    */
