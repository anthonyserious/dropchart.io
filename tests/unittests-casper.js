var testUrl = "http://localhost:8100";

casper.test.begin('dropchart.io testing', 2, function suite(test) {
    casper.start(testUrl, function() {
      test.assertTitle("dropchart.io", "dropchart.io title is correctly set.");
    });

    casper.then(function() {
      var dropchartExists = casper.evaluate(function() {
        return typeof dropchart === "object";
      });

      test.assert(dropchartExists, "dropchart object properly initialized");
    });

    casper.run(function() {
      test.done();
    });
});


