"use strict"

var dropchart = function() {
  var dropArea;
  var chartParent;

  // Inputs object.  Operations wrapping chart input/img tuples.
  var chartInputs = function() {
    var inputs = [];
    return {
      init: function() {
        inputs = [];
      },
      reset: function() {
        inputs = [];
      },
      addInput: function(f) {
        inputs.push({input: f, img: ""});
      },
      getInput: function(n) {
        return inputs[n].input;
      },
      setImg: function(n, s) {
        inputs[n].img = s;
      },
      getImg: function(n) {
        return inputs[n].img;
      },
      getLength: function() {
        return inputs.length;
      },
      sort: function() {
        inputs.sort(function(a, b) {
          return a.input.options.title.localeCompare(b.input.options.title);
        });
      }
    }
  }();

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
        "fontSize":"12"
      },
      position:"bottom"
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

  // build a single chart
  function drawAll(elem) {
    if(google) {
      google.load("visualization", "1.0", {
              packages:["corechart"],
              callback: function () {
                for (var i = 0; i < chartInputs.getLength(); i++) {
                  var input = chartInputs.getInput(i);
                  if (input['status']) {
                    $('#chartDiv'+i).html("<p><b>Filename: </b>"+input.filename+"</p><p><b>Status: </b>"+input['status']+"</p><p><b>Message: </b>"+input.message+"</p>");
                    $('#chartDiv'+i).parents().find('.row').attr("name", input.options.title);
                  } else {
                    var chartData = google.visualization.arrayToDataTable(input.values);
                    var func;
                    if (input.options.chartType) {// && chartTypes[chartInputs[i].options.chartType]) {
                      func = google.visualization[input.options.chartType];
                    } else{
                      func = google.visualization["SteppedAreaChart"];
                    }
                    var chart = new func(document.getElementById("chartDiv"+i));
                    google.visualization.events.addListener(chart, 'ready', function () {
                      chartInputs.setImg(i, chart.getImageURI());
                    });
                    chart.draw(chartData, input.options);
                  }
                }
              }
          }
      );
    }
  }

  // When files are dropped, process them asynchronously and store the inputs in chartInputs
  function readFile(file) {
    //console.log(file);
    var reader = new FileReader();
    var deferred = $.Deferred();
 
    function readerOnLoadEventHandler(evt) {
      var obj = {};
      var inData = {};
      var file_type = file.name.split('.').pop().toLowerCase();

      if (file_type === "json") {
        try { 
          inData = JSON.parse(evt.target.result);
        } catch(e) { 
          obj = {filename: file.name, status: "syntax error", message: e, options:{title:file.name} };
        }
        
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

            
      chartInputs.addInput(obj);
      var len = chartInputs.getLength();
      chartParent.append(
        '<div class="row">'
        +'<div class="col-md-1 dropBtnDiv">'
        //+'<button type="button" class="btn btn-default btn dc-btn"><span class="glyphicon glyphicon-floppy-save"></span></button>'
        +'<button type="button" class="btn btn-default btn-lg dc-btn" id="btnChartDivImg'+(len-1)+'" data-toggle="tooltip" data-placement="bottom" title="Generate PNG image from chart."><span class="glyphicon glyphicon-download-alt"></span></button>'
        +'&nbsp;</div>'
        + '<div class="col-md-10" align="center">'
        +   '<div id="chartDiv'+(len-1)+'" class="chartDiv drop-shadow"></div>'
        + '</div>'
        +'<div class="col-md-1">&nbsp;</div>'
        +'</div>');
      $('#btnChartDivImg'+(len-1)).tooltip();
      $('#btnChartDivImg'+(len-1)).click(function(){
        var c = $('#imgDiv').children();
        if (c) { c.remove(); }
        $('#imgDiv').append("<img src='"+ chartInputs.getImg(len-1)+"'>");

        $('#modalImg').modal();
        
      });
      deferred.resolve(evt.target.result);
    } // fileEventHandler

    reader.onerror = function() {
        deferred.reject(this);
    };

    reader.onload = readerOnLoadEventHandler;

    reader.readAsText(file);
    return deferred.promise();
  } // readFile()

  return {
    init:function(inDropArea, inChartParent)  {
      dropArea = inDropArea;
      chartParent = inChartParent;
      chartInputs.init();
      
      // handle "change" event on the "inputFiles" input field for mobile devices
      function inputFilesHandler(evt) {
        var files = evt.target.files;
        var promises = [];
        chartInputs.reset();

        for (var i = 0, f; f = files[i]; i++) {
          promises[i] = readFile(f);
        }
        $.when.apply($, promises).done(function() {
          chartInputs.sort();
          drawAll(chartParent);
        });
      }

      function dropAreaDropHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        $("body").toggleClass('draggingData');
        var chartChildren = chartParent.children();
        if (chartChildren) { chartChildren.remove(); }
        chartInputs.reset();

        var promises = [];
        if(evt.originalEvent.dataTransfer){
          for (var i = 0; i < evt.originalEvent.dataTransfer.files.length; i++) {
            var file = evt.originalEvent.dataTransfer.files[i];
            promises[i] = readFile(file);
          }
          $.when.apply($, promises).done(function() {
            chartInputs.sort();
            drawAll(chartParent);
          });
        }
      }

      dropArea.on('dragstart', function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
      });

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

      dropArea.on('drop', dropAreaDropHandler);
      document.getElementById('inputFiles').addEventListener('change', inputFilesHandler, false);

    } // init
  } // return

}();

