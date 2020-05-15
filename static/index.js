$.get("/data", function (data) {
  df = JSON.parse(data["dataframe_world"]);
  map = data["map"];
  timeseries = data["timeseries"];
  width = $("#choropleth").width();
  height = $("#choropleth").height();
  draw_map(df, map, width, height);
  width = $("#lineplot").width();
  height = $("#lineplot").height();
  console.log(width, height)
  draw_line_plot(timeseries, width, height, JSON.parse(data['dates'])['data']);
});
