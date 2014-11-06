function ParseToDropchartIo() {
  // nothing
};

//
//  Return 6 objects:  procs, memory, swap, io, system, and cpu.
//
//  This, like other dropchart.io functions, operates on a (potentially large) buffer.  It should be rewritten to use streams.
ParseToDropchartIo.prototype.parseVmstat_Ubuntu = function(inputString, inputTitle) {
  var results = {
    inputType: "vmstat_ubuntu",
    custom: {
      procs: {options:{title:inputTitle+" procs"}, values:[['i', 'r', 'b']]},
      memory: {options:{title:inputTitle+" memory"},values:[['i', 'swpd', 'free', 'buff', 'cache']]},
      swap:{options:{title:inputTitle+" swap"},values:[['i', 'si', 'so']]},
      io:{options:{title:inputTitle+" io"},values:[['i', 'bi', 'bo']]},
      system:{options:{title:inputTitle+" system"},values:[['i', 'in', 'cs']]},
      cpu:{options:{title:inputTitle+" cpu"},values:[['i', 'us', 'sy', 'id', 'wa', 'st']]}
    }
  };

  var obj = {};
  var cols = [ 'r', 'b', 'swpd', 'free', 'buff', 'cache', 'si', 'so', 'bi', 'bo', 'in', 'cs', 'us', 'sy', 'id', 'wa', 'st' ];
  var lines = inputString.split("\n");
  var headerRe = /^procs -----------memory----------/;
  var headerRe2 = /buff/; // Good enough???
  var emptyLineRe = /^\s*$/;

  if (headerRe.exec(lines.shift()) === null) { 
    obj.status = "error";
    return {status:"error"};
  }

  obj.values = []; // initialize these
  var i = 0;
  lines.forEach(function(line) {
    var a = headerRe.exec(line);
    var b = headerRe2.exec(line);
    var c = emptyLineRe.exec(line);
    if (a === null && b === null && c === null) {
      var arr = line.trim().split(/\s+/);
      arr = arr.map(parseInt);
      if (arr.length === cols.length) {
        results.custom.procs.values.push([i.toString(), arr[0], arr[1]]);
        results.custom.memory.values.push([i.toString(), arr[2], arr[3], arr[4], arr[5]]);
        results.custom.swap.values.push([i.toString(), arr[6], arr[7]]);
        results.custom.io.values.push([i.toString(), arr[8], arr[9]]);
        results.custom.system.values.push([i.toString(), arr[10], arr[11]]);
        results.custom.cpu.values.push([i.toString(), arr[12], arr[13], arr[14], arr[15], arr[16]]);
      } else {
        obj.status = "error";
        return obj;
      }
    } else { /* ??? */ }
    i++;
  });
  //obj.values.unshift(cols);
  //console.log(JSON.stringify(results));
  return results;
}

parseToDropchartIo = new ParseToDropchartIo();


