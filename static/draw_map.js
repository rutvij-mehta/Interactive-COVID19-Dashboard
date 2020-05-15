// The svg
function draw_map(cv_data, map, width, height) {

  var initX;
  var mouseClicked = false;
  var s = 1;
  var rotated = 0;
  var data = d3.map();
  var colorScale = d3
    .scaleThreshold()
    .domain([10, 500, 5000, 10000, 20000, 30000, 50000, 500000])
    .range(d3.schemeBlues[9]);
  mapping_country = {}
  for (i = 0; i < cv_data.length; i++) {
    data.set(cv_data[i]["Country Code"], +cv_data[i]["TotalConfirmed"]);
    mapping_country[cv_data[i]["Country Code"]] = cv_data[i]["Country"]
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


  svg.call(zoom);

  function rotateMap(endX) {
    projection.rotate([rotated + ((endX - initX) * 360) / (s * width), 0, 0]);
    g.selectAll("path").attr("d", path);
  }

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
  let mouseOver = function (d) {
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.5);
    d3.select(this).transition().duration(200).style("opacity", 1);
    x1 = d3.mouse(this)[0];
    y1 = d3.mouse(this)[1];

    svg
      .append("text")
      .attr("x", x1 - 5)
      .attr("y", y1 - 5)
      .attr("id", "number_textbox")
      .text(function () {
        return d.total;
      });


    d3.select('#lineplot').select('#US').attr("opacity", function () {
      return 0;
    })
  };

  let mouseLeave = function (d) {
    d3.select("#number_textbox").remove();
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.8);
    d3.select(this).transition().duration(200).style("stroke", "transparent");
    // tip.hide();
  };

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
    .on("mouseleave", mouseLeave);

  // svg.call(tip);
}
