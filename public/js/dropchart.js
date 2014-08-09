"use strict"

var dropchart = function() {
  var dropArea;
  var chartDiv;

  var colorSchemes = {
    none: [],
    first: ["#993350", "#055333", "#394600", "#90A437", "#277455"]
  }

  var defaultOptions = {
    title: "A chart on dropchart.io",
    colors: colorSchemes.first,
    backgroundColor: {
      stroke: '#055333',
      strokeWidth: 1
    }
  }

  var chartTypes = [
    "AreaChart",
    "BarChart",
    "BubbleChart",
    "CandlestickChart",
    "ColumnChart",
    "ComboChart",
    "GeoChart",
    "Histogram",
    "LineChart",
    "PieChart",
    "ScatterChart",
    "SteppedAreaChart"
  ];

  // build a single chart
  function drawOne(elem, options, chartType, values) {
    if(google) {
      google.load("visualization", "1.0", {
              packages:["corechart"],
              callback: function () {
                  var chartData = google.visualization.arrayToDataTable(values);
                  var chart = new google.visualization[chartType](elem);
                  chart.draw(chartData, options);
              }
          }
      );
    }
  }

  return {
    init:function(inDropArea, inChartDiv)  {
      dropArea = inDropArea;
      chartDiv = inChartDiv;

      dropArea.on('dragover', function(e) {
          e.preventDefault();
          e.stopPropagation();
      });
      dropArea.on('dragenter', function(e) {
          e.preventDefault();
          e.stopPropagation();
      });

      dropArea.on('drop', function(e){
          e.preventDefault();
          e.stopPropagation();
          if(e.originalEvent.dataTransfer){
              if(e.originalEvent.dataTransfer.files.length) {
                  var file = e.originalEvent.dataTransfer.files[0];
                  var reader = new FileReader();

                  reader.onload = function(evt) {
                      var inData = JSON.parse(evt.target.result);
                      var options = defaultOptions;
                      if (inData['options']) {
                          for (var k in inData['options']) {
                            options[k] = inData['options'][k];
                          }
                      }
                      drawOne(chartDiv[0], options, "SteppedAreaChart", inData['values']);
                  }
                  reader.readAsText(file);
              }
          }
      });
    } // init
  } // return

}();

