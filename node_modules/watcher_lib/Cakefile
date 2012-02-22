{spawn, exec} = require 'child_process'

option '-p', '--prefix [DIR]', 'set the installation prefix for `cake install`'

task 'build', 'continually build the watcher_lib library with --watch', ->
  coffee = spawn 'coffee', ['-cb', '-o', 'lib', 'src']
  coffee.stdout.on 'data', (data) -> console.log data.toString().trim()

task 'install', 'install the `watcher_lib` command into /usr/local (or --prefix)', (options) ->
  base = options.prefix or '/usr/local'
  lib  = base + '/lib/watcher_lib'
  exec([
    'mkdir -p ' + lib
    'cp -rf README.markdown resources lib ' + lib
  ].join(' && '), (err, stdout, stderr) ->
   if err then console.error stderr
  )

task 'doc', 'rebuild the watcher_lib documentation', ->
  exec([
    'docco src/watcher_lib.coffee'
    'sed "s/docco.css/resources\\/docco.css/" < docs/watcher_lib.html > Documentation.html'
    'rm -r docs'
  ].join(' && '), (err) ->
    throw err if err
  )
