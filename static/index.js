$.get("/data", function (data) {
  df = JSON.parse(data["dataframe_world"]);
  df2 = data["map"];
  width = $("#choropleth").width();
  height = $("#choropleth").height();
  draw_map(df, df2, width, height);
});
