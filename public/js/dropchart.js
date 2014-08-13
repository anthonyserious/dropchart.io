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
            $("#saveButton").show();
        }
    }
});


$('#saveButton').hide();


$('#saveButton').click(function(){
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
        console.log( canvas.toDataURL( "image/png" ) );
    };

    $("body").append(img);



    // var img = $('#chart_div');
    // html2canvas(img, {
    //     letterRendering: true,
    //     background: undefined,
    //     logging: true,
    //     allowTaint: true,
    //     onrendered: function(canvas) {
    //     var new_img = canvas.toDataURL("image/png");
    //     window.open(new_img);
    //     }
    // });
});

