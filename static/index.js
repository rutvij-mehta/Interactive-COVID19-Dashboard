$.get("/data", function (data) {
  df = JSON.parse(data["dataframe_world"]);
  par_data = JSON.parse(data["parallel_cords"])

  map = data["map"];
  timeseries1 = data["timeseries"];
  timeseries2 = data["timeseries"];



  width = $("#lineplot").width();
  height = $("#lineplot").height();


  dates = JSON.parse(data['dates'])['data']
  plot_data = createDataLinePlot(timeseries2, dates, "new_case")
  par_data = update_par_data(par_data, plot_data)

  draw_line_plot(plot_data, width, height, par_data);

  width = $("#choropleth").width();
  height = $("#choropleth").height();
  draw_map(plot_data, map, width, height, timeseries1, JSON.parse(data['dates'])['data'], par_data);

  width = $("#barchart").width();
  height = $("#barchart").height();
  draw_bar(plot_data, width, height);

  width = $("#scatterplot").width();
  height = $("#scatterplot").height();
  draw_scatter(plot_data, width, height, par_data, "Cases", "Deaths");

  width = $("#parallel").width();
  height = $("#parallel").height();
  df = JSON.parse(data["parallel_cords"]);
  parallel(par_data, width, height, null);
});

function update_par_data(par_data, timeseries) {
  new_data = {}
  new_data_map = d3.map()

  new_data_death = {}
  new_data_recovered = {}
  new_data_death_map = d3.map()
  new_data_recovered_map = d3.map()

  timeseries.forEach(function (d) {

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


  par_data.forEach(function (d) {
    update_Case = new_data_map.get(d['Country Code'])
    update_Death = new_data_death_map.get(d['Country Code'])
    update_Recovered = new_data_recovered_map.get(d['Country Code'])
    d['Cases'] = update_Case
    d['Deaths'] = update_Death
    d['Recovered'] = update_Recovered
  })

  return par_data


}



function createDataLinePlot(data, dates, ylabel) {


  max_cases = []
  /* Format Data */
  var parseDate = d3.timeParse("%Y-%m-%d");
  temp_data = []
  keys = d3.keys(data)

  for (var i = 0; i < keys.length; i++) {

    country_name = keys[i]
    country_list = data[country_name]

    country_code = country_list[country_list.length - 1]["CountryCode"] // last row contains country code
    total_confirmed = country_list[country_list.length - 3]["confirmed"] // second last contains NaN values
    total_death = country_list[country_list.length - 3]["deaths"]
    total_recovered = country_list[country_list.length - 3]["recovered"]

    country_list[0]["new_case"] = country_list[0]["confirmed"]
    country_list[0]["new_death"] = country_list[0]["deaths"]
    country_list[0]["new_recovered"] = country_list[0]["recovered"]
    for (var j = 1; j < country_list.length - 2; j++) {
      country_list[j]["new_case"] = Math.max(0, country_list[j]["confirmed"] - country_list[j - 1]["confirmed"])
      country_list[j]["new_death"] = Math.max(0, country_list[j]["deaths"] - country_list[j - 1]["deaths"])
      country_list[j]["new_recovered"] = Math.max(0, country_list[j]["recovered"] - country_list[j - 1]["recovered"])
    }
    temp_data.push({ 'name': name, 'values': country_list, 'total_confirmed': total_confirmed, 'total_death': total_death, 'total_recovered': total_recovered, 'CountryCode': country_code, 'CountryName': country_name })
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

  // console.log(data)
  plot_data = []
  mapping = {}

  for (i = 0; i < data.length; i++) {

    val = data[i]["values"]
    country_code = data[i]["CountryCode"]
    country_name = data[i]["CountryName"]
    mapping[i] = country_code
    plot_val = []
    tc = 0
    td = 0
    tr = 0

    // console.log(val)
    for (j = 0; j < val.length - 2; j++) {
      date = val[j]["date"]
      cases = val[j][ylabel]
      deaths = val[j]['new_death']
      recovered = val[j]['new_recovered']

      tc = tc + cases
      td = td + deaths
      tr = tr + recovered


      // if (isNaN(cases) || cases < 0)
      //   cases = 0
      // if (isNaN(deaths) || deaths < 0)
      //   deaths = 0

      // if (isNaN(recovered) || recovered < 0)
      //   recovered = 0

      plot_val.push([date, cases, country_code, deaths, recovered, country_name])


    }

    plot_data.push(plot_val)
  }

  return plot_data
}