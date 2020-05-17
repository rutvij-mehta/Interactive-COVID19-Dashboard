function draw_bar(data, width, height) {
    margin = { top: 25, right: 25, bottom: 25, left: 25 }
    console.log(height)
    var y = d3.scaleBand()
        .range([height - 4 * margin.top, 0])
        .padding(0);

    var x = d3.scaleLinear()
        .range([0, width]);

    var svg = d3.select("#barchart").append("svg")
        .attr("width", width)
        .attr("height", height - margin.top)
        .style('overflow-y', 'scroll')
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + 2 * margin.top + ")")
        ;
    i = 0
    reduced = []
    data.forEach(function (d) {
        d.TotalConfirmed = +d.TotalConfirmed

        if (d['Country Code'] == 'USA') {
            d.Country = d['Country Code']
        }
        if (d.TotalConfirmed > 5000) {
            reduced[i] = d
            i += 1
        }

    })

    console.log(reduced)
    data = reduced


    x.domain([0, d3.max(data, function (d) { return d.TotalConfirmed; })])
    y.domain(data.map(function (d) { return d.Country; }));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("id", (d) => d['Country Code'])
        .attr("width", function (d) { return x(d.TotalConfirmed); })
        .attr("y", function (d) { return y(d.Country); })
        .attr("height", y.bandwidth())
        .append("text")
        .text(function (d) {
            return d.Country
        })
        ;

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + (- 20) + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format(".0s")))
        .style('stroke', '#fff');

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .style('stroke', '#fff')
        .selectAll('.tick')
        .attr("transform", function (d) {
            string = d3.select(this).attr('transform');
            translate = string.substring(string.indexOf("(") + 1, string.indexOf(")")).split(",");
            return 'translate(200,' + translate[1] + ')'
        })
        ;


}