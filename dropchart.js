$(document).ready(function() {
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                var res = JSON.parse(reader.result);

                var palette = new Rickshaw.Color.Palette({ scheme: 'munin' } );

                var seriesData = [ [], [] ];
                for (var i = 0; i < res.values.length; i++) {
                        seriesData[0][i] = { 
                                x: Date.parse(res['values'][i]['date']),
                                y: res.values[i]['user'] 
                        }; 
                        seriesData[1][i] = { 
                                x: Date.parse(res['values'][i]['date']),
                                y: res.values[i]['sys'] 
                        }; 
                }

                var graph = new Rickshaw.Graph({
                                element: document.getElementById("chart"),
                                width: 900,
                                height: 500,
                                renderer: 'area',
                                stroke: true,
                                preserve: true,
                                series: [
                                                {
                                                                color: palette.color(),
                                                                data: seriesData[0],
                                                                name: 'series1'
                                                }, {
                                                                color: palette.color(),
                                                                data: seriesData[1],
                                                                name: 'series2'
                                                }
                                ]
                });
                graph.render();
                var preview = new Rickshaw.Graph.RangeSlider( {
                                graph: graph,
                                element: document.getElementById('preview'),
                } );
                var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                        graph: graph,
                        xFormatter: function(x) {
                                return new Date(x * 1000).toString();
                        }
                } );

                var annotator = new Rickshaw.Graph.Annotate( {
                        graph: graph,
                        element: document.getElementById('timeline')
                } );

                var legend = new Rickshaw.Graph.Legend( {
                        graph: graph,
                        element: document.getElementById('legend')

                } );

                var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
                        graph: graph,
                        legend: legend
                } );

                var order = new Rickshaw.Graph.Behavior.Series.Order( {
                        graph: graph,
                        legend: legend
                } );

                var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
                        graph: graph,
                        legend: legend
                } );

                var smoother = new Rickshaw.Graph.Smoother( {
                        graph: graph,
                        element: document.querySelector('#smoother')
                } );

                var ticksTreatment = 'glow';

                var xAxis = new Rickshaw.Graph.Axis.Time( {
                        graph: graph,
                        ticksTreatment: ticksTreatment,
                        timeFixture: new Rickshaw.Fixtures.Time.Local()
                } );

                xAxis.render();

                var yAxis = new Rickshaw.Graph.Axis.Y( {
                        graph: graph,
                        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                        ticksTreatment: ticksTreatment
                } );

                yAxis.render();


                var controls = new RenderControls( {
                        element: document.querySelector('form'),
                        graph: graph
                } );

                var previewXAxis = new Rickshaw.Graph.Axis.Time({
                        graph: preview.previews[0],
                        timeFixture: new Rickshaw.Fixtures.Time.Local(),
                        ticksTreatment: ticksTreatment
                });

                                    previewXAxis.render();


            }

            reader.readAsText(file);	
        } else {
            fileDisplayArea.innerText = "File not supported!"
        }
    });
});


