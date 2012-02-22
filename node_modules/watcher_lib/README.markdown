A library that can watch a directory and recompile files if they change. Can be used to build watcher scripts such as less-watcher or coffee-watcher.

To install watcher_lib via npm simply do:

    sudo npm install watcher_lib

To see how it's used check following projects:

* Automatically compile changed Less files https://amix.github.com/less-watcher/
* Automatically compile changed Coffee files https://amix.github.com/coffee-watcher/

Sample usage (code from less-watcher):

```coffeescript
# Use `watcher-lib`, a library that abstracts away most of the implementation details.
# This library also makes it possible to implement any watchers (see coffee-watcher for an example).
watcher_lib = require './watcher-lib/watcher-lib'


# Searches through a directory structure for *.less files using `find`.
# For each .less file it runs `compileIfNeeded` to compile the file if it's modified.
findLessFiles = (dir) ->
    watcher_lib.findFiles('*.less', dir, compileIfNeeded)


# Keeps a track of modified times for .less files in a in-memory object,
# if a .less file is modified it recompiles it using compileLessScript.
#
# When starting the script all files will be recompiled.
WATCHED_FILES = {}
compileIfNeeded = (file) ->
    watcher_lib.compileIfNeeded(WATCHED_FILES, file, compileLessScript)


# Compiles a file using `lessc`.
#
# Compilation errors are printed out to stdout.
compileLessScript = (file) ->
    fnGetOutputFile = (file) -> file.replace(/([^\/\\]+)\.less/, '.less.$1.css')
    watcher_lib.compileFile("lessc #{ file }", file, fnGetOutputFile)


# Starts a poller that polls each second in a directory that's
# either by default the current working directory or a directory that's passed through process arguments.
watcher_lib.startDirectoryPoll(process.argv[0] or '.', findLessFiles)
```
