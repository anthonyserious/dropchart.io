"use strict"

var dropchart = function() {
  var dropArea;
  var chartParent;
  var chartInputs = [];

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
  function drawAll(elem) {
    console.log("chartInputs: "+chartInputs);
    if(google) {
      google.load("visualization", "1.0", {
              packages:["corechart"],
              callback: function () {
                for (var i = 0; i < chartInputs.length; i++) {
                  elem.append(
                    '<div class="row">'
                    +'<div class="col-md-1">&nbsp;</div>'
                    + '<div class="col-md-10" align="center">'
                    +   '<div id="chartDiv'+i+'" class="chartDiv drop-shadow"></div>'
                    + '</div>'
                    +'<div class="col-md-1">&nbsp;</div>'
                    +'</div>');
                  var chartData = google.visualization.arrayToDataTable(chartInputs[i].values);
                  var chart = new google.visualization["SteppedAreaChart"](document.getElementById("chartDiv"+i));
                  //google.visualization.events.addListener(chart, 'ready', function () {
                    //elem.innerHTML = '<img src="' + chart.getImageURI() + '">';
                    //console.log(elem.innerHTML);
                  //});
                  chart.draw(chartData, chartInputs[i].options);
                }
              }
          }
      );
    }
  }

  // When files are dropped, process them asynchronously and store the inputs in chartInputs[]
  function readFile(file) {
    var reader = new FileReader();
    var deferred = $.Deferred();
 
    reader.onload = function(evt) {
        deferred.resolve(evt.target.result);
    };
 
    reader.onerror = function() {
        deferred.reject(this);
    };

    reader.onload = function(evt) {
      var inData = JSON.parse(evt.target.result);
      var options = defaultOptions;
      if (inData['options']) {
          for (var k in inData['options']) {
            options[k] = inData['options'][k];
          }
      }
      var obj = {options: options, values: inData['values']};
      chartInputs.push(obj);
      deferred.resolve(evt.target.result);
    }
 
    reader.readAsText(file);
    console.log("returning");
    return deferred.promise();
  } // readFile()

  return {
    init:function(inDropArea, inChartParent)  {
      dropArea = inDropArea;
      chartParent = inChartParent;

      dropArea.on('dragover', function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
      });
      dropArea.on('dragenter', function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
      });

      dropArea.on('drop', function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var promises = [];
        if(evt.originalEvent.dataTransfer){
          for (var i = 0; i < evt.originalEvent.dataTransfer.files.length; i++) {
            var file = evt.originalEvent.dataTransfer.files[i];
            promises[i] = readFile(file);
          }
          $.when.apply($, promises).done(function(a) {
            drawAll(chartParent);
            console.log("length: "+chartInputs.length);
            for (var i = 0; i < chartInputs.length; i++) {
              console.log(chartInputs[i]);
            }
          });
        }
      }); // on('drop')
    } // init
  } // return

}();

