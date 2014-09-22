"use strict"

var dropchart = function() {
  var dropArea;
  var chartParent;
  var imgWidth = ($(window).width() * 0.7) + 'px';
  var modalWidth = ($(window).width() * 0.75) + 'px';
  var editor;

  // Inputs object.  Operations wrapping chart input/img tuples.
  var chartInputs = function() {
    var inputs = [];
    var beingEdited = -1;
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
      setInput: function(n, f) {
        inputs[n] = {input: f, img: ""};
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
      setChartType: function(i, chartType) {
        inputs[i].input.options.chartType = chartType;
      },
      setBeingEdited: function(id) { 
        beingEdited = id;
      },
      getBeingEdited: function() {
        return beingEdited;
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
    first: ["#993350", "#055333", "#394600", "#90A437", "#277455"],
    second: ["#1A55DE", "#FFE404", "#FF5504", "#FFAB04", "#092D80", "#702400", "#704B00"]
  }

  var defaultOptions = {
    title: "Untitled",
    // "width": '100%',
    height: '350',
    chartType: "SteppedAreaChart",
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
      });
    }
  }

  // Create a div to host a chart or display exception details.
  function createChartDiv(inc, createButtons) {
    var buttonsText = "";
    //  Create buttons by default
    if (typeof createButtons === "undefined") { createButtons = true; }
    if (createButtons) {
      //  Button to display PNG 
      buttonsText = '<button type="button" class="btn btn-default btn-lg dc-btn" id="btnChartDivImg'+inc+'" data-toggle="tooltip" data-placement="bottom" title="Generate PNG image from chart."><span class="glyphicon glyphicon-download-alt"></span></button>';

      //  Button to display JSON
      buttonsText += '<p><button type="button" class="btn btn-default btn-lg dc-btn" id="btnChartDivJSON'+inc+'" data-toggle="tooltip" data-placement="bottom" title="Display JSON chart request."><span class="glyphicon glyphicon-file"></span></button>';

      //  Select menu to select different chart type
      buttonsText += '<select class="form-control dc-select" id="select'+inc+'">';
      buttonsText += '<option selected="selected">Chart type</option>';
      chartTypes.forEach(function(opt) { buttonsText += '<option id="'+opt+'">'+opt+'</option>'; });
      buttonsText += '</select>';
    }

    chartParent.append(
        '<div class="row">'
        +'<div class="col-md-1 dropBtnDiv">'
        //+'<button type="button" class="btn btn-default btn dc-btn"><span class="glyphicon glyphicon-floppy-save"></span></button>'
        +buttonsText
        +'&nbsp;</div>'
        + '<div class="col-md-10" align="center">'
        +   '<div id="chartDiv'+inc+'" class="chartDiv drop-shadow"></div>'
        + '</div>'
        +'<div class="col-md-1">&nbsp;</div>'
        +'</div>');

    //  Event handler for chart type select
    $('#select'+inc).change(function() {
      var opt = $('#select'+inc+' option:selected').val();
      if (opt !== "Chart type") {
        chartInputs.setChartType(inc, opt);
        drawAll(chartParent);
      }
    });
  }

  //
  //  All parse logic contained here.  Supported file types:
  //  *  JSON
  //  *  CSV
  //  *  ...vmstat (Linux, Solaris)
  //
  function parseInput(input) {
    var obj = {};
    var inData = {};
    var fileType = input.fileName.split('.').pop().toLowerCase();
    
    if (fileType === "json") {
      try { 
        inData = JSON.parse(input.data);
      } catch(e) { 
        obj = {filename: input.fileName, status: "syntax error", message: e, options:{title:input.fileName} };
      }
      
      if (obj.hasOwnProperty('status') === false) {
        var newOptions = {};
        // merge default and custom options
        for (var k in defaultOptions) {
          newOptions[k] = defaultOptions[k];
        }
        // automatically set the chart title to be the filename (minus extension)
        newOptions.title = input.fileName.split('.')[0];
        if (inData['options']) {
          for (var k in inData['options']) {
            newOptions[k] = inData['options'][k];
          }
        } 
        obj = {options: newOptions, values: inData['values']};
      }
    } else { // Just assume that the default is CSV.  if (fileType === "csv") {
      var newOptions = {};
      for (var k in defaultOptions) {
        newOptions[k] = defaultOptions[k];
      }
      // automatically set the chart title to be the filename (minus extension)
      newOptions.title = input.fileName.split('.')[0];
      inData = Papa.parse(input.data, {dynamicTyping:true});

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
    return obj;
  }

  // When files are dropped, process them asynchronously and store the inputs in chartInputs
  function readFile(file) {
    //console.log(file);
    var reader = new FileReader();
    var deferred = $.Deferred();
 
    function readerOnLoadEventHandler(evt) {
      var obj = {};
      
      //  This gets passed to our parser
      var request = {fileName: file.name, data: evt.target.result};
      obj = parseInput(request);

      chartInputs.addInput(obj);
      var len = chartInputs.getLength();
      createChartDiv(len-1, true);

      //  Set up modal to display PNG
      $('#btnChartDivImg'+(len-1)).tooltip();
      $('#btnChartDivImg'+(len-1)).click(function(){
        var c = $('#imgDiv').children();
        if (c) { c.remove(); }
        $('#imgDiv').append("<img width='" + imgWidth + "'  src='"+ chartInputs.getImg(len-1)+"'>");
        $('#imgDiv').css('margin-left', '-5px')
        $('#modalImg').modal();
        $('.modal-body').width(modalWidth)
        // $('.modal-open').css('width', width);
      });

      //  Set up modal to display/edit JSON request
      $('#btnChartDivJSON'+(len-1)).tooltip();
      $('#btnChartDivJSON'+(len-1)).click(function(){
        var c = $('#jsonDiv').children();
        if (c) { c.remove(); }
        $('#editorDiv').append(JSON.stringify(chartInputs.getInput(len-1), null, "\t"));
        chartInputs.setBeingEdited(len-1);
        $('#modalEditor').modal();
        $('#btnEditorSave').click(function() {
          var obj = {};
          try { 
            obj = JSON.parse(editor.getSession().getValue());
            chartInputs.setInput(len-1, obj);
            drawAll();
          } catch(e) { 
            var fileName = chartInputs.getInput(len-1).options.title;
            obj = {filename: fileName, status: "syntax error", message: e, options:{title:fileName} };
            chartInputs.setInput(len-1, obj);
            drawAll();
          }
        });
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
          //  Something weird happened during processing.  The occurs when dragging files from a Windows zip folder, for instance.
          if (evt.originalEvent.dataTransfer.files.length === 0) {
            var msg = "Something weird happened and your files couldn't be processed!  This is known to happen if you drag and drop files from a Windows compressed folder (i.e. if you opened dropchart.io's samples ZIP file in Windows and tried dragging from there).  If this is what happened then please try extracting the files to a regular folder and dragging from there.";
            var obj = {filename: "Unknown filename", status: "syntax error", message: msg, options:{title:"Weird error."} };
            createChartDiv(0, false);
            chartInputs.addInput(obj);
            drawAll(chartParent);
          } else {
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
      }

      dropArea.on('dragstart', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $("body").addClass('draggingData');
      });

      dropArea.on('dragover', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $("body").addClass('draggingData');
      });

      dropArea.on('dragenter', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $("body").addClass('draggingData');
      });

      dropArea.on('dragleave', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $("body").removeClass('draggingData');
      });

      dropArea.on('drop', dropAreaDropHandler);
      document.getElementById('inputFiles').addEventListener('change', inputFilesHandler, false);

      //  reset modals
      $('#modalHelp').on('hidden.bs.modal', function() { });//$('#btnHelp').button('reset'); });
      $('#modalAbout').on('hidden.bs.modal', function() { $('#btnAbout').button('reset'); });
      $('#modalEditor').on('show.bs.modal', function() { 
        console.log("showing");
        editor = ace.edit("editorDiv");
        editor.getSession().setMode("ace/mode/json");
      });
    } // init
  } // return

}();

