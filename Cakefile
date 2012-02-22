{spawn, exec} = require 'child_process'

option '-p', '--prefix [DIR]', 'set the installation prefix for `cake install`'

task 'build', 'continually build the less-watcher library with --watch', ->
  coffee = spawn 'coffee', ['-c', '-o', 'lib', 'src']
  coffee.stdout.on 'data', (data) -> console.log data.toString().trim()

task 'install', 'install the `less-watcher` command into /usr/local (or --prefix)', (options) ->
  base = options.prefix or '/usr/local'
  lib  = base + '/lib/less-watcher'
  exec([
    'mkdir -p ' + lib
    'cp -rf bin README resources lib ' + lib
    'ln -sf ' + lib + '/bin/less-watcher ' + base + '/bin/less-watcher'
  ].join(' && '), (err, stdout, stderr) ->
   if err then console.error stderr
  )

task 'doc', 'rebuild the less-watcher documentation', ->
  exec([
    'docco src/less-watcher.coffee'
    'sed "s/docco.css/resources\\/docco.css/" < docs/less-watcher.html > Documentation.html'
    'rm -r docs'
  ].join(' && '), (err) ->
    throw err if err
  )
