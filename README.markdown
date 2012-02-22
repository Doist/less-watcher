less-watcher is a script that can watch a directory and recompile your .less scripts if they change.
It's useful for development as you don't need to think about recompiling your Less files.

It searches in a recursive manner so sub-directories are handled as well.

To install less-watcher via npm simply do:

    $ sudo npm install less-watcher

To use less-watcher simply do:

    less-watcher -p [prefix] -d [directory]
    
    Options:
      -d  Specify which directory to scan.                                                                         [default: "."]
      -p  Which prefix should the compiled files have? Default is style.less will be compiled to .less.style.css.  [default: ".less."]
      -h  Prints help                                                                                              [boolean]

For more info read:
http://amix.github.com/less-watcher/
