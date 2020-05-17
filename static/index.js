$.get("/data", function (data) {
  df = JSON.parse(data["dataframe_world"]);
  map = data["map"];
  timeseries = data["timeseries"];

  width = $("#choropleth").width();
  height = $("#choropleth").height();
  us_data = data["dataframe_US"]
  draw_map(df, map, width, height, us_data, data['us']);

  width = $("#lineplot").width();
  height = $("#lineplot").height();

  draw_line_plot(timeseries, width, height, JSON.parse(data['dates'])['data']);

  width = $("#barchart").width();
  height = $("#barchart").height();
  console.log(width, height)
  draw_bar(df, width, height);
});
