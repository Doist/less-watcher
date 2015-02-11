(function() {
  var WATCHED_FILES, argv, compileIfNeeded, compileLessScript, findLessFiles, specs, usage, watcher_lib;

  usage = "Watch a directory and recompile .less styles if they change.\nUsage: less-watcher -p [prefix] -d [directory].";

  specs = require('optimist').usage(usage)
  ["default"]('d', '.').describe('d', 'Specify which directory to scan.')
  ["default"]('t', '.').describe('t', 'Specify which directory to compile.')
  ["default"]('f', '*.less').describe('f', 'Specify which file to compile.')
  ["default"]('g', null).describe('g', 'Generates only on *.css file respecting @import')
  ["default"]('p', '.less.').describe('p', 'Which prefix should the compiled files have? Default is style.less will be compiled to .less.style.css.').
  boolean('h').describe('h', 'Prints help');

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
    var fnGetOutputFile, prefix, targetDir, targetFiles;
    prefix = argv.p === true ? '' : argv.p;
    targetDir = argv.t === '.' ? '' : argv.t;
    targetFiles = argv.f === '*.less' ? file : argv.f;

    var globalFile = undefined;
    if (argv.g !== null) {
        globalFile = argv.g === true ? 'app.less' : argv.g;
    }

    fnGetOutputFile = function(file) {
      return file.replace(/([^\/\\]+)\.less/, "" + (targetDir + prefix) + "$1.css");
    };

    if (globalFile === undefined) {
        return watcher_lib.compileFile("lessc " + targetFiles, targetFiles, fnGetOutputFile);
    }
    else {
        return watcher_lib.compileFile("lessc " + globalFile, globalFile, fnGetOutputFile);
    }
  };

  watcher_lib.startDirectoryPoll(argv.d, findLessFiles);

}).call(this);
