# **less-watcher** is a script that can watch
# a directory and recompile your [.less styles](http://lesscss.org/) if they change.
#
# It's very useful for development as you don't need to think about
# recompiling your Less files.  Search is done in a recursive manner
# so sub-directories are handled as well.
#
#     Usage:
#       less-watcher -p [prefix] -d [directory]
#
#     Options:
#       -d  Specify which directory to scan.                                                                         [default: "."]
#       -p  Which prefix should the compiled files have? Default is style.less will be compiled to .less.style.css.  [default: ".less."]
#       -h  Prints help                                                                                              [boolean]
#
# Installing less-watcher is easy with [npm](http://npmjs.org/):
#
#       sudo npm install less-watcher
#
# Run this to watch for changes in the current working directory:
#
#       less-watcher
#
# Run this to watch for changes in a specified directory:
#
#       less-watcher -d ~/Desktop/my_project
#
# less-watcher requires:
#
# * [node.js](http://nodejs.org/)
# * [find](http://en.wikipedia.org/wiki/Find)
# * [watcher_lib](https://github.com/amix/watcher_lib)
# * [optimist](https://github.com/amix/optimist)


# Specify the command line arguments for the script (using optimist)
usage = "Watch a directory and recompile .less styles if they change.\nUsage: less-watcher -p [prefix] -d [directory]."
specs = require('optimist')
        .usage(usage)

        .default('d', '.')
        .describe('d', 'Specify which directory to scan.')

        .default('p', '.less.')
        .describe('p', 'Which prefix should the compiled files have? Default is style.less will be compiled to .less.style.css.')

        .boolean('h')
        .describe('h', 'Prints help')


# Handle the special -h case
if specs.parse(process.argv).h
    specs.showHelp()
    process.exit()
else
    argv = specs.argv


# Use `watcher-lib`, a library that abstracts away most of the implementation details.
# This library also makes it possible to implement any watchers (see coffee-watcher for an example).
watcher_lib = require 'watcher_lib'


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


# Compiles a file using `lessc`. Compilation errors are printed out to stdout.
compileLessScript = (file) ->
    prefix = if argv.p == true then '' else argv.p
    fnGetOutputFile = (file) -> file.replace(/([^\/\\]+)\.less/, "#{prefix}$1.css")
    watcher_lib.compileFile("lessc #{ file }", file, fnGetOutputFile)


# Starts a poller that polls each second in a directory that's
# either by default the current working directory or a directory that's passed through process arguments.
watcher_lib.startDirectoryPoll(argv.d, findLessFiles)
