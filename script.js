var url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
/* import json data as js object*/
var req = new XMLHttpRequest();

req.open("GET", url, true);
req.onload = () => {
  values = JSON.parse(req.responseText);
  console.log(values);
  scales();
  dots();
  axes();
};
req.send();

var xScale;
var yScale;
var xAxis;
var yAxis;
var values = [];

var width = 800;
var height = 500;
var padding = 50;

var svgContainer = d3.select("svg");

svgContainer.attr("width", width);
svgContainer.attr("height", height);

var scales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(values, (item) => {
        return item["Year"];
      }) - 1,
      d3.max(values, (item) => {
        return item["Year"];
      }) + 1,
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(values, (item) => {
        return new Date(item["Seconds"] * 1000);
      }),
      d3.max(values, (item) => {
        return new Date(item["Seconds"] * 1000);
      }),
    ])
    .range([padding, height - padding]);
};

var axes = () => {
  xAxis = d3
    .axisBottom(xScale)
    /* setting values to decimal format*/
    .tickFormat(d3.format("d"));

  svgContainer
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svgContainer
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};

var dots = () => {
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("width", "250px")
    .style("height", "30px")
    .style("visibility", "hidden");

  svgContainer
    .selectAll("circle")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "6")
    .attr("data-xvalue", (index) => {
      return index["Year"];
    })
    .attr("data-yvalue", (item) => {
      return new Date(item["Seconds"] * 1000);
    })
    .attr("cx", (item) => {
      return xScale(item["Year"]);
    })
    .attr("cy", (item) => {
      return yScale(new Date(item["Seconds"] * 1000));
    })
    .attr("fill", (item) => {
      if (item["Doping"] != "") {
        return "#Ff8f05";
      } else {
        return "#Fcff05";
      }
    })
    .on("mouseover", (item, index) => {
      tooltip
        .transition()
        .style("visibility", "visible")
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 60 + "px");

      if (item["Doping"] != "") {
        tooltip.text(
          index["Name"] +
            " : " +
            index["Year"] +
            ", " +
            index["Time"] +
            " - " +
            index["Doping"]
        );
      } else {
        tooltip.text(
          index["Name"] +
            " : " +
            index["Year"] +
            ", " +
            index["Time"] +
            " - " +
            "No Allegations"
        );
      }
      tooltip.attr("data-year", index["Year"]);
    })
    .on("mouseout", (item) =>
      tooltip.transition().style("visibility", "hidden")
    );
};
