var execute, fs;
execute = require('child_process').exec;
fs = require('fs');
exports.findFiles = function(fileext, dir, fnCompile) {
  return execute("find " + dir + " -name '" + fileext + "' -print", function(error, stdout, stderr) {
    var file, _i, _len, _ref, _results;
    _ref = stdout.split('\n');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      _results.push(file ? fnCompile(file) : void 0);
    }
    return _results;
  });
};
exports.compileIfNeeded = function(watched_files, file, fnCompileFile) {
  return fs.stat(file, function(err, stats) {
    var new_mtime, old_mtime, should_compile;
    old_mtime = watched_files[file];
    new_mtime = new Date(stats.mtime);
    if (!old_mtime) {
      should_compile = true;
    } else if (new_mtime > old_mtime) {
      should_compile = true;
    } else {
      should_compile = false;
    }
    watched_files[file] = new_mtime;
    if (should_compile) {
      return fnCompileFile(file);
    }
  });
};
exports.compileFile = function(command, file, fnGetOutputfile) {
  return execute(command, function(error, stdout, stderr) {
    var output_filename;
    if (error !== null) {
      return console.log(error.message);
    } else {
      output_filename = fnGetOutputfile(file);
      return fs.writeFile(output_filename, stdout.toString(), function(err) {
        if (err) {
          throw err;
        }
        return console.log("Compiled " + file + " to " + output_filename);
      });
    }
  });
};
exports.startDirectoryPoll = function(dir, fnFindFiles) {
  var directoryPoll;
  directoryPoll = function() {
    return fnFindFiles(dir);
  };
  directoryPoll();
  return setInterval(directoryPoll, 1000);
};