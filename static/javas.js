function getDDValue(){
    var val = document.getElementById("bootdropdown")
    console.log("Dropdown value: " + val.value)
    return val.value
};
function getDDValue_data(){
    var val = document.getElementById("bootdropdown_data")
    console.log("Dropdown value: " + val.value)
    return val.value
};
function outputGraph(data, graph_name){
    data_dict = {'Original Data': 'Original', 'Random Sampled Data': 'Random', 'Stratified Sampled Data': 'Stratified'}
    data = data_dict[data]

    if(graph_name == 'Scree Plot'){
        screePlot()
    }
    else if(graph_name == 'Top 2 PCA Scatterplot'){
        task3a(data)
    }
    else if(graph_name == 'MDS Euclidian Scatterplot'){
        task3b(data, 'Euclidian')
    }
    else if(graph_name == 'MDS Correlation Scatterplot'){
        task3b(data, 'Correlation')
    }
    else if(graph_name == 'Scatterplot Matrix'){
        task3c(data)
    }
}

// Task 2 - scree plot
function screePlot() {
    $.post("/screeplot", {'data':'received'}, function(data_post){
        variances = []
        prefix_sum_variances = []
        
        variances.push(data_post["variance1"])
        prefix_sum_variances.push(data_post["prefix_sum_variance1"])

        variances.push(data_post["variance2"])
        prefix_sum_variances.push(data_post["prefix_sum_variance2"])

        variances.push(data_post["variance3"])
        prefix_sum_variances.push(data_post["prefix_sum_variance3"])
        console.log(variances)
        console.log(prefix_sum_variances)
        generateScreePlot(variances, prefix_sum_variances)  
    });
} 

// Task 3a
function task3a(data_type){
    send_data = {'data':data_type}
    $.post("/top2pca", {data:JSON.stringify(send_data)}, function(data_post){
        data = data_post["data"]
        generate2DScatterPlot(data)  
    });
}

// Task 3b
function task3b(data_type, distance){
    send_data = {'data':data_type, 'distance':distance}
    $.post("/mds", {data:JSON.stringify(send_data)}, function(data_post){
        data = data_post["data"]
        generate2DScatterPlot(data)  
    });
}

// Task 3c - Scatterplot Matrix
function task3c(data_type){
    send_data = {'data':data_type}
    $.post("/Scatterplotmatrix", {data:JSON.stringify(send_data)}, function(data_post){
        data = data_post["data"]
        generateScatterPlotMatrix(data)  
    });
}
// --------------------------------------------------Plots---------------------------------------------------------
// functions to generate and plot scree plot
function generateScreePlot(variance, prefix_sum_variance){
    d3.select("body").selectAll("svg").remove()
    
    plotScreePlot(variance[0], prefix_sum_variance[0], 50, 100, 'Original Data')
    plotScreePlot(variance[1], prefix_sum_variance[1], 100, 100, 'Random Sampled Data')
    plotScreePlot(variance[2], prefix_sum_variance[2], -800, 400, 'Stratified Sampled Data')
}

function plotScreePlot(variance, prefix_sum_variance, xdisp, ydsip, data_type){
    plot_data = []
    for(var i = 0; i < variance.length; i++){
        plot_data.push({"key":i+1, "count":variance[i]})
    }

    plot_data_line_chart = []
    for(var i = 0; i < prefix_sum_variance.length; i++){
        plot_data_line_chart.push({"key":i+1, "count":prefix_sum_variance[i]})
    }
    
    svg = d3.select("body").append("svg")
            .attr("width", 600)
            .attr("height", 400)

    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin

    svg.attr("transform", "translate(" + xdisp + "," + ydsip + ")")

    // creating x and y axes
    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    // creating the group tag where all the elements of the graph would be appended
    var g = svg.append("g")
            .attr("transform", "translate(" + 80 + "," + 50 + ")")
            .style("align", "center");
        
    xScale.domain(plot_data_line_chart.map(function(d){ return d["key"] }))
    yScale.domain([0, d3.max(plot_data_line_chart, function(d){ return d["count"] })])

    // horizontal and vertical line + highlighted circle
    horzliney = height * 0.75
    g.append("line")
    .style("stroke-dasharray","5,5")
    .style("stroke", "black") 
    .attr("x1", 0)
    .attr("x2", 400)
    .attr("y1", height - horzliney)
    .attr("y2", height - horzliney)

    vertlinex = 167
    g.append("line")
    .style("stroke-dasharray","5,5")
    .style("stroke", "black") 
    .attr("x1", vertlinex)
    .attr("x2", vertlinex)
    .attr("y1", height)
    .attr("y2", height - 180)

    g.append("circle")
    .style("stroke", "gray")
    .style("fill", "white")
    .attr("r", 10)
    .attr("cx", vertlinex)
    .attr("cy", height - horzliney);

    g.append("circle")
    .style("stroke", "gray")
    .style("fill", "red")
    .attr("r", 6)
    .attr("cx", vertlinex)
    .attr("cy", height - horzliney);

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
    .text(data_type) 

    // adding rectangle bars with transition, mouseover and mouseout
    g.selectAll(".bar")
        .data(plot_data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d){ return xScale(d["key"]); })
        .attr("y", function(d){ return yScale(d["count"]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d){ return height - yScale(d["count"]) });

    // line plot
    g.append("path")
        .datum(plot_data_line_chart)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return xScale(d.key) + xScale.bandwidth()/2 })
            .y(function(d) { return yScale(d.count) })
            )
}

// code for a 2D scatterplot
function generate2DScatterPlot(data) {
    // data format [{"dx": dx, "dy": dy}, ...]
    d3.select("body").selectAll("svg").remove()
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    svg = d3.select("body").append("svg")
            .attr("width", 800)
            .attr("height", 600)

    // var svg = d3.select("svg"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin

    svg.attr("transform", "translate(" + 50 + "," + 50 + ")");
    var xScale = d3.scaleLinear().range ([0, width])
        yScale = d3.scaleLinear().range ([height, 0]);  

    var g = svg.append("g")
            .attr("transform", "translate(" + 80 + "," + 50 + ")")
            .style("align", "center");

        // x and y axis domain
        console.log(d3.max(data, function(d){ return d["dx"] }))
        delta_x = (d3.max(data, function(d){ return d["dx"] }) - d3.min(data, function(d){ return d["dx"] }))/10
        xScale.domain([d3.min(data, function(d){ return d["dx"] }), d3.max(data, function(d){ return d["dx"] })+delta_x])
        yScale.domain([d3.min(data, function(d){ return d["dy"] }), d3.max(data, function(d){ return d["dy"] })+0.2])
        
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
         .attr("transform", "translate("+ 250 +","+ (height+75) +")")
         .text("PC1")

        // appending y axis
        g.append("g")
         .attr("transform", "translate(0," + 0 + ")")
         .call(d3.axisLeft(yScale).tickFormat(function(d){return d;})
         .ticks(10))

        // adding labels for y axis
        d3.select("svg").append("g")
          .attr("transform", "translate("+ 20 +","+ (250) +")")
          .append("text")
          .style("text-anchor", "start")
          .attr("transform","rotate(-90)")
          .text("PC2")  

        // Add dots
        g.append('g')
            .attr("transform", "translate("+ 40 +","+ 0 +")")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.dx); } )
            .attr("cy", function (d) { return yScale(d.dy); } )
            .attr("r", 3)
            .style("fill", "steelblue")
}

// input to this
// data = [{row1}, {row2},...]
// {row1} = {'feature1': v1, 'feature2': v2,...} 
function generateScatterPlotMatrix(data){
    console.log(data)
    d3.select("body").selectAll("svg").remove()
    // var traits = ["MSSubClass", "LotArea", "MasVnrArea"],
    // console.log(data[0])
    var traits = Object.keys(data[0]),
        n = traits.length;
    console.log(traits)
    var width = 900,
        size = (width / n) - 12,
        padding = 24;

    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(1)
            .tickFormat(d3.format("d"));

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(1)
            .tickFormat(d3.format("d"));;

    var domainByTrait = {};

    traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
    });
    console.log(domainByTrait)
    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    svg = d3.select("body").append("svg")
            .attr("width", 1200)
            .attr("height", 1200)

    var svg = d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { console.log(domainByTrait[d])
            x.domain(domainByTrait[d]).nice();
            d3.select(this).call(xAxis);
        });

    svg.selectAll(".y.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", size/2)
        .attr("y", size/2)
        .attr("text-anchor", "middle")
        .text(function(d) { return d.x; });

    function plot(p) {
        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .classed("diagonal", function(d) {return d.i === d.j; })
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.filter(function(d) {return d.i !== d.j; })    // hide diagonal marks
        .selectAll("circle")
        .data(data)
        .enter().append("circle")
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 2.5)
            .style("fill", "steelblue");
    
    }
    // });

    function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
    }
}
// for scatter plot matrix: data = [[features_row_1],[features_row_2],[features_row_3],[features_row_4]]