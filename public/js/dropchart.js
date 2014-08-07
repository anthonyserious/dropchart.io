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
    e.preventDefault();
    e.stopPropagation();
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
                            }
                        }
                    );
                }
            }
            reader.readAsText(file);
        }
    }
});

