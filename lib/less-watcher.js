(function() {
  var WATCHED_FILES, argv, compileIfNeeded, compileLessScript, findLessFiles, specs, usage, watcher_lib;
  usage = "Watch a directory and recompile .less styles if they change.\nUsage: less-watcher -p [prefix] -d [directory].";
  specs = require('optimist').usage(usage)["default"]('d', '.').describe('d', 'Specify which directory to scan.')["default"]('p', '.less.').describe('p', 'Which prefix should the compiled files have? Default is style.less will be compiled to .less.style.css.').boolean('h').describe('h', 'Prints help');
  if (specs.parse(process.argv).h) {
    specs.showHelp();
    process.exit();
  } else {
    argv = specs.argv;
  }
  watcher_lib = require('watcher_lib');
  findLessFiles = function(dir) {
    return watcher_lib.findFiles('*.less', dir, compileIfNeeded);
  };
  WATCHED_FILES = {};
  compileIfNeeded = function(file) {
    return watcher_lib.compileIfNeeded(WATCHED_FILES, file, compileLessScript);
  };
  compileLessScript = function(file) {
    var fnGetOutputFile;
    fnGetOutputFile = function(file) {
      return file.replace(/([^\/\\]+)\.less/, "" + argv.p + "$1.css");
    };
    return watcher_lib.compileFile("lessc " + file, file, fnGetOutputFile);
  };
  watcher_lib.startDirectoryPoll(argv.d, findLessFiles);
}).call(this);
