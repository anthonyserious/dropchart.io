var testUrl = "http://localhost:8100";

casper.test.begin('dropchart.io testing', 3, function suite(test) {
  //
  //  Confirm that the HTML actually loads.
  //
  casper.start(testUrl, function() {
    test.assertTitle("dropchart.io", "dropchart.io title is correctly set.");
  });

  //  Confirm that dropchart.js loads without error and the dropchart variable is created.
  casper.then(function() {
    var dropchartExists = casper.evaluate(function() {
      return typeof dropchart === "object";
    });
    test.assert(dropchartExists, "dropchart object properly initialized");
  });

  //
  //  Test uploading multiple files
  //
  casper.then(function() {
    this.page.uploadFile('input[name=inputFiles]', 
      ['./dropchart-io-samples/linechart.json',
      './dropchart-io-samples/syntaxerror.json']);
    var chartDivExists = casper.evaluate(function() {
      return typeof $('#chartDiv0') === "object" && typeof $('#chartDiv1') === "object";
    });
    test.assert(chartDivExists, "Chart divs are properly created after uploading two files.");
  });

  //
  //  Everything defined, now run
  //
  casper.run(function() {
    test.done();
  });
});


