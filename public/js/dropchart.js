"use strict"
<<<<<<< HEAD
$('#dropArea').on('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
});
$('#dropArea').on('dragenter', function(e) {
    e.preventDefault();
    e.stopPropagation();
});

$('#dropArea').on('drop', function(e){
    e.preventDefault();
    e.stopPropagation();
    // $("#saveButton").show();
    if(e.originalEvent.dataTransfer){
        if(e.originalEvent.dataTransfer.files.length) {
            var file = e.originalEvent.dataTransfer.files[0];
            var reader = new FileReader();

            reader.onload = function(evt) {
                var inData = JSON.parse(evt.target.result);
                //console.log(evt.target.result);
                //console.log(inData);
                if(google) {
                    google.load("visualization", "1.0", {
                            packages:["corechart"],
                            callback: function () {
                                var chartData = google.visualization.arrayToDataTable(inData['values']);
                                var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
                                chart.draw(chartData, inData['options']);
                            



                                // WILL THIS WORK

                                // convert svg to png
                                var svg = document.querySelector( "svg" );
                                var svgData = new XMLSerializer().serializeToString( svg );
                                 
                                var canvas = document.createElement( "canvas" );
                                var ctx = canvas.getContext( "2d" );
                                 
                                var img = document.createElement( "img" );
                                img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );
                                img.onload = function() {
                                    ctx.drawImage( img, 0, 0 );        
                                    // Now is done
                                    // console.log( canvas.toDataURL( "image/png" ) );
                                    // canvas.toDataURL( "image/png" );
                                    // window.open(canvas.toDataURL( "image/png" ))
                                };
                                var exportLink = document.createElement('a');
                                console.log(img);
                                exportLink.attr('href', +"'" + img.src + "'" );
                                exportLink.text('my_chart.png');
                                $('.new_image_container').append(exportLink);









                            }
                        }
                    );
                }
            }
            reader.readAsText(file);
        }
    }
}); 

$('#saveButton').hide();







=======

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
                  reader.readAsText(file);
              }
          }
      });
    } // init
  } // return

}();
>>>>>>> 5aaf9279ede7efb543278d04496f5269ce9efe23

