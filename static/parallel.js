

function parallel(data, width, height, tag) {

    console.log(data)



    var margin = { top: 25, right: 25, bottom: 25, left: 75 },
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;
    innerHeight = height - 2


    var devicePixelRatio = window.devicePixelRatio || 1;
    Countries = data.map(value => value.Country);
    CountryCodes = data.map(value => value['Country Code']);
    ColorRange = [d3.interpolateTurbo(0)]
    prev = 0
    for (var i = 1; i < Countries.length; i++) {
        ColorRange[i] = d3.interpolateTurbo(prev + 1 / Countries.length)
        prev = prev + 1 / Countries.length
    }

    var color = d3.scaleOrdinal()
        //.range(["#5DA5B3", "#D58323", "#DD6CA7", "#54AF52", "#8C92E8", "#E15E5A", "#725D82", "#776327", "#50AB84", "#954D56", "#AB9C27", "#517C3F", "#9D5130", "#357468", "#5E9ACF", "#C47DCB", "#7D9E33", "#DB7F85", "#BA89AD", "#4C6C86", "#B59248", "#D8597D", "#944F7E", "#D67D4B", "#8F86C2"]);
        .range(ColorRange)
    var types = {
        "Number": {
            key: "Number",
            coerce: function (d) { return +d; },
            extent: d3.extent,
            within: function (d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
            defaultScale: d3.scaleLinear().range([innerHeight, 0])
        },
        "String": {
            key: "String",
            coerce: String,
            extent: function (data) { return data.sort(); },
            within: function (d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
            defaultScale: d3.scalePoint().range([0, innerHeight])
        },
        "Date": {
            key: "Date",
            coerce: function (d) { return new Date(d); },
            extent: d3.extent,
            within: function (d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
            defaultScale: d3.scaleTime().range([0, innerHeight])
        }
    };

    var dimensions = [

        {
            key: "Population",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
        {
            key: "Density (P/Km²)",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
        {
            key: "Land Area (Km²)",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
        {
            key: "Migrants (net)",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
        {
            key: "Fert. Rate",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
        {
            key: "Med. Age",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
        {
            key: "Cases",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
        {
            key: "Recovered",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
        {
            key: "Deaths",
            type: types["Number"],
            scale: d3.scaleLinear().range([innerHeight, 0])
        },
    ];

    var xscale = d3.scalePoint()
        .domain(d3.range(dimensions.length))
        .range([0, width]);

    var yAxis = d3.axisLeft();

    var container = d3.select("#parallel").append("div")
        .attr("class", "parcoords")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + "px");

    var svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var canvas = container.append("canvas")
        .attr("width", width * devicePixelRatio)
        .attr("height", height * devicePixelRatio)
        .style("width", width + "px")
        .style("height", height + "px")
        .style("margin-top", margin.top + "px")
        .style("margin-left", margin.left + "px");

    var ctx = canvas.node().getContext("2d");
    ctx.globalCompositeOperation = 'darken';
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1.5;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    var output = d3.select("body").append("pre");

    var axes = svg.selectAll(".axis")
        .data(dimensions)
        .enter().append("g")
        .attr("class", function (d) { return "axis " + d.key.replace(/ /g, "_"); })
        .attr("transform", function (d, i) { return "translate(" + xscale(i) + ")"; });

    //data = d3.shuffle(data);

    data.forEach(function (d) {
        dimensions.forEach(function (p) {
            d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
        });

        // truncate long text strings to fit in data table
        for (var key in d) {
            if (d[key] && d[key].length > 35) d[key] = d[key].slice(0, 36);
        }
    });

    // type/dimension default setting happens here
    dimensions.forEach(function (dim) {
        if (!("domain" in dim)) {
            // detect domain using dimension type's extent function
            dim.domain = d3_functor(dim.type.extent)(data.map(function (d) { return d[dim.key]; }));
        }
        if (!("scale" in dim)) {
            // use type's default scale for dimension
            dim.scale = dim.type.defaultScale.copy();
        }
        dim.scale.domain(dim.domain);
    });
    var plot_line = []

    color_mapping = {}
    data.forEach(function (d) {
        color_mapping[d['CountryCode']] = color(d['Country Code'])
    })

    console.log("Data before tag", data)
    if (tag != null) {
        data.forEach(function (d) {
            if (tag.includes(d['Country Code'])) {
                plot_line.push(d)
            }

        })
        country_highlighted_color = color(plot_line[0]['Country Code'])
        console.log(country_highlighted_color)
        data = plot_line

    }


    var render = renderQueue(draw).rate(50);

    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = d3.min([10 / Math.pow(data.length, 0.3), 1]);
    render(data);

    axes.append("g")
        .each(function (d) {
            var renderAxis = "axis" in d
                ? d.axis.scale(d.scale)  // custom axis
                : yAxis.scale(d.scale);  // default axis
            d3.select(this).call(renderAxis);
        })
        .append("text")
        .attr("class", "title")
        .attr("text-anchor", "start")
        .text(function (d) { return "description" in d ? d.description : d.key; });

    // Add and store a brush for each axis.
    axes.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(d.brush = d3.brushY()
                .extent([[-10, 0], [10, height]])
                .on("start", brushstart)
                .on("brush", brush)
                .on("end", brush)
            )
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    d3.selectAll(".axis.food_group .tick text")
        .style("fill", color);



    function project(d) {
        return dimensions.map(function (p, i) {
            // check if data element has property and contains a value
            if (
                !(p.key in d) ||
                d[p.key] === null
            ) return null;

            return [xscale(i), p.scale(d[p.key])];
        });
    };

    function draw(d) {


        ctx.strokeStyle = color(d['Country Code']);
        if (tag != null) {
            ctx.strokeStyle = color_mapping[tag]
        }
        ctx.beginPath();
        var coords = project(d);
        coords.forEach(function (p, i) {
            // this tricky bit avoids rendering null values as 0
            if (p === null) {
                // this bit renders horizontal lines on the previous/next
                // dimensions, so that sandwiched null values are visible
                if (i > 0) {
                    var prev = coords[i - 1];
                    if (prev !== null) {
                        ctx.moveTo(prev[0], prev[1]);
                        ctx.lineTo(prev[0] + 6, prev[1]);
                    }
                }
                if (i < coords.length - 1) {
                    var next = coords[i + 1];
                    if (next !== null) {
                        ctx.moveTo(next[0] - 6, next[1]);
                    }
                }
                return;
            }

            if (i == 0) {
                ctx.moveTo(p[0], p[1]);
                return;
            }

            ctx.lineTo(p[0], p[1]);
        });
        ctx.stroke();
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        render.invalidate();

        var actives = [];
        svg.selectAll(".axis .brush")
            .filter(function (d) {
                return d3.brushSelection(this);
            })
            .each(function (d) {

                actives.push({

                    dimension: d,
                    extent: d3.brushSelection(this)
                });
            });

        var selected = data.filter(function (d) {
            if (actives.every(function (active) {
                var dim = active.dimension;
                // test if point is within extents for each active brush
                return dim.type.within(d[dim.key], active.extent, dim);
            })) {
                return true;
            }


        });

        selected_codes = selected.map((value) => value['Country Code'])

        console.log(selected_codes.length)

        var axis;

        let clicked = function (d) {
            axis = d.key
            d3.select("#scatterplot").select("svg").remove()
            draw_scatter(data, $('#scatterplot').width(), $('#scatterplot').height(), data, 'Cases', axis)

        }

        d3.selectAll('.axis').on('click', clicked
        )




        if (selected_codes.length == 185) {
            resetAllGraphs_ParallelCords()

        }
        else {
            updateAllGraphs_ParallelCords(selected_codes)
        }



        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = d3.min([10 / Math.pow(selected.length, 0.3), 1]);
        render(selected);


    }


}

function d3_functor(v) {
    return typeof v === "function" ? v : function () { return v; };
};

function updateAllGraphs_ParallelCords(selected_codes) {


    var map = d3.select("#choropleth").selectAll("path").style("opacity", function (d) {

        if (selected_codes.includes(d.id))
            return 1
        else if (selected_codes.includes)
            return 0.25


    })

    var line = d3.select("#lineplot").selectAll(".line").style('opacity', function (r, j) {

        if (selected_codes.includes(r[0][2])) {

            return 1
        }
        return 0

    });


    var bar = d3.select("#barchart").selectAll("rect").style("opacity", function (r) {

        if (selected_codes.includes(r['Country Code']))
            return 1
        else
            return 0
    })

    var scatter = d3.select("#scatterplot").selectAll("circle")
    scatter.style('opacity', function (r) {

        if (selected_codes.includes(r['CountryCode'])) {
            return 1

        }
        return 0.25

    })
        .attr('r', function (r) {
            if (selected_codes.includes(r['CountryCode'])) {
                return 10
            }
            return 5
        })


}

function resetAllGraphs_ParallelCords() {
    var map = d3.select("#choropleth").selectAll("path").style("opacity", 0.85)
    var line = d3.select("#lineplot").selectAll(".line").style('opacity', 1)
    var bar = d3.select("#barchart").selectAll("rect").style("opacity", 1)
    var scatter = d3.select("#scatterplot").selectAll("circle").style("opacity", 0.5).attr('r', 5)


}