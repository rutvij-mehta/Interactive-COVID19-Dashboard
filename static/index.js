$.get("/data", function (data) {
  df = JSON.parse(data["dataframe_world"]);
  map = data["map"];
  timeseries = data["timeseries"];

  width = $("#choropleth").width();
  height = $("#choropleth").height();
  us_data = data["dataframe_US"]
  draw_map(df, map, width, height);

  width = $("#lineplot").width();
  height = $("#lineplot").height();

  draw_line_plot(timeseries, width, height, JSON.parse(data['dates'])['data']);

  width = $("#barchart").width();
  height = $("#barchart").height();

  draw_bar(df, width, height);

  width = $("#parallel").width();
  height = $("#parallel").height();
  df = JSON.parse(data["parallel_cords"]);
  parallel(df, width, height);
});
