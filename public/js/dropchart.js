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
    title: "Untitled",
    titleTextStyle:{
		fontName:"Trebuchet MS, Helvetica, sans-serif",
		fontSize:"24",
	},
	legend:{
		textStyle:{
			"fontName":"lucida console",
			"fontSize":"18"
		}	
	},
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


// Get a local file upload working

  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    // // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      readFile(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);


  // build a single chart
  function drawAll(elem) {
    if(google) {
      google.load("visualization", "1.0", {
              packages:["corechart"],
              callback: function () {
                for (var i = 0; i < chartInputs.length; i++) {
                  if (chartInputs[i]['status']) {
                    $('#chartDiv'+i).html("<p><b>Filename: </b>"+chartInputs[i].filename+"</p><p><b>Status: </b>"+chartInputs[i]['status']+"</p><p><b>Message: </b>"+chartInputs[i].message+"</p>");
                  } else {
                    var chartData = google.visualization.arrayToDataTable(chartInputs[i].values);
                    var func;
                    if (chartInputs[i].options.chartType) {// && chartTypes[chartInputs[i].options.chartType]) {
                      func = google.visualization[chartInputs[i].options.chartType];
                    } else{
                      func = google.visualization["SteppedAreaChart"];
                    }
                    var chart = new func(document.getElementById("chartDiv"+i));
                    //google.visualization.events.addListener(chart, 'ready', function () {
                      //elem.innerHTML = '<img src="' + chart.getImageURI() + '">';
                      //console.log(elem.innerHTML);
                    //});
                    chart.draw(chartData, chartInputs[i].options);
                  }
                }
              }
          }
      );
    }
  }

  // When files are dropped, process them asynchronously and store the inputs in chartInputs[]
  function readFile(file) {
    console.log(file);
    var reader = new FileReader();
    var deferred = $.Deferred();
 
    reader.onerror = function() {
        deferred.reject(this);
    };

    reader.onload = function(evt) {
      var obj = {};
      var inData = {};
      var file_type = file.name.split('.').pop().toLowerCase();

      if (file_type === "json") {
        try { 
          inData = JSON.parse(evt.target.result);
        } catch(e) { 
          obj = {filename: file.name, status: "syntax error", message: e };
        }
        
        // if (!obj['status']) {
        if (obj.hasOwnProperty('status') === false) {
          var newOptions = {};
          // merge default and custom options
          for (var k in defaultOptions) {
            newOptions[k] = defaultOptions[k];
          }
          // automatically set the chart title to be the filename (minus extension)
          newOptions.title = file.name.split('.')[0];
          if (inData['options']) {
            for (var k in inData['options']) {
              newOptions[k] = inData['options'][k];
            }
          } 
          obj = {options: newOptions, values: inData['values']};
        }
      } else { // Just assume that the default is CSV.  if (file_type === "csv") {
        var newOptions = {};
        for (var k in defaultOptions) {
          newOptions[k] = defaultOptions[k];
        }
        // automatically set the chart title to be the filename (minus extension)
        newOptions.title = file.name.split('.')[0];
        inData = Papa.parse(evt.target.result, {dynamicTyping:true});

        // If first line starts with a number, then assume that there's no X-axis series labels.  Autopopulate them here.
        if (inData.data.length > 1 && typeof inData.data[1][0] === "number") {
          var arrayLength = inData.data[0].length;
          inData.data[0].unshift("Series");
          for (var i = 1; i < inData.data.length; i++) {

            inData.data[i].unshift(i.toString());
          }
        }
        obj = {options: newOptions, values: inData.data};
      }

            
      chartInputs.push(obj);
      chartParent.append(
        '<div class="row">'
        +'<div class="col-md-1 dropBtnDiv">'
        //+'<button type="button" class="btn btn-default btn dc-btn"><span class="glyphicon glyphicon-floppy-save"></span></button>'
        //+'<button type="button" class="btn btn-default btn dc-btn"><span class="glyphicon glyphicon-eject"></span></button>'
        +'&nbsp;</div>'
        + '<div class="col-md-10" align="center">'
        +   '<div id="chartDiv'+[chartInputs.length-1]+'" class="chartDiv drop-shadow"></div>'
        + '</div>'
        +'<div class="col-md-1">&nbsp;</div>'
        +'</div>');

      deferred.resolve(evt.target.result);
    }

    reader.readAsText(file);
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
        $("body").toggleClass('draggingData');
      });
      dropArea.on('dragleave', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $("body").toggleClass('draggingData');
      });

      dropArea.on('drop', function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        $("body").toggleClass('draggingData');
        var chartChildren = chartParent.children();
        if (chartChildren) { chartChildren.remove(); }
        chartInputs = [];

        var promises = [];
        if(evt.originalEvent.dataTransfer){
          for (var i = 0; i < evt.originalEvent.dataTransfer.files.length; i++) {
            var file = evt.originalEvent.dataTransfer.files[i];
            promises[i] = readFile(file);
          }
          $.when.apply($, promises).done(function() {
            drawAll(chartParent);
          });
        }
      }); // on('drop')
    } // init
  } // return

}();
