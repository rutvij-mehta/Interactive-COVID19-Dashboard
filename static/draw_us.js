function draw_us(data, height, width, us_map) {
    d3.select("#choropleth").select('svg').remove()

    var svg = d3
        .select("#choropleth")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    const g = svg.append("g");
    var projection = d3.geoAlbers()
        .scale((width - 1) / 2 / Math.PI).translate([width / 2, height / 2])
    var path = d3.geoPath().projection(projection);



    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json", function (error, us) {
        if (error) throw error;

        g.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("d", path);

        g.append("path")
            .attr("class", "state-borders")
            .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; })));
    });

}



