"use strict"

var dropchart = function() {
  var dropArea;
  var chartParent;

  var colorSchemes = {
    none: [],
    first: ["#993350", "#055333", "#394600", "#90A437", "#277455"]
  }

  var defaultOptions = {
    title: "A chart on dropchart.io",
    colors: colorSchemes.first,
    backgroundColor: {
      stroke: '#055333',
      strokeWidth: 0
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
                  //google.visualization.events.addListener(chart, 'ready', function () {
                    //elem.innerHTML = '<img src="' + chart.getImageURI() + '">';
                    //console.log(elem.innerHTML);
                  //});
                  chart.draw(chartData, options);
              }
          }
      );
    }
  }

  return {
    init:function(inDropArea, inChartParent)  {
      dropArea = inDropArea;
      chartParent = inChartParent;

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
              for (var i = 0; i < e.originalEvent.dataTransfer.files.length; i++) {
              //if(e.originalEvent.dataTransfer.files.length) {
                  var file = e.originalEvent.dataTransfer.files[i];
                  var reader = new FileReader();
                  var chartId = "chartDiv"+i;

                  chartParent.append('<div class="col-md-1">&nbsp;</div><div class="col-md-10" align="center"><div id="'+chartId+'" class="chartDiv drop-shadow"></div></div><div class="col-md-1">&nbsp;</div>');

                  // building a control flow for csv or json
                  var file_type = file.name.split('.').pop();

                  if ( file_type === "json") {

                    reader.onload = function(evt) {
                        var inData = JSON.parse(evt.target.result);
                        var options = defaultOptions;
                        if (inData['options']) {
                            for (var k in inData['options']) {
                              options[k] = inData['options'][k];
                            }
                        }
                        drawOne($('#'+chartId)[0], options, "SteppedAreaChart", inData['values']);
                    }

                  } // else goes here

                  reader.readAsText(file);
              }
          }
      });
    } // init
  } // return

}();

