"use strict"
    $('#dropArea').on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $('#dropArea').on('dragenter', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $('#dropArea').on('drop', function(e){
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                var file = e.originalEvent.dataTransfer.files[0];
                var reader = new FileReader();

                reader.onload = function(evt) {
                    var inData = JSON.parse(evt.target.result);
                    console.log(evt.target.result);
                    console.log(inData);
                    google.load("visualization", "1", {packages:["corechart"]});
                    var v = [
                      ["series1", "series2"],
                      [123, 102],
                      [113, 112]
                    ];
                    function drawChart() {
                        var chartData = google.visualization.arrayToDataTable(v);
                        //var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
                        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
                        chart.draw(chartData, {title:"foo"});
                    }
                    //google.setOnLoadCallback(drawChart);
                }
                reader.readAsText(file);
            }
        }
    });

    

