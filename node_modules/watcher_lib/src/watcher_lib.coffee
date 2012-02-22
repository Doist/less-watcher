# Require external dependencies (only node.js libs for now).
execute = require('child_process').exec
fs = require('fs')

# Searches through a directory structure for `fileext` files using `find`.
# For each `fileext` file it runs `fnCompile` to compile the file if it's modified.
exports.findFiles = (fileext, dir, fnCompile) ->
    execute("find #{dir} -name '#{fileext}' -print",
           (error, stdout, stderr) ->
               for file in stdout.split('\n')
                   fnCompile file if file
    )


# Keeps a track of modified times for files in a in-memory object (`watched_files`),
# if a file is modified it recompiles it using fnCompileFile.
#
# When starting the script all files will be recompiled.
exports.compileIfNeeded = (watched_files, file, fnCompileFile) ->
    fs.stat(file, (err, stats) ->
        old_mtime = watched_files[file]
        new_mtime = new Date(stats.mtime)

        if !old_mtime
            should_compile = true
        else if new_mtime > old_mtime
            should_compile = true
        else
            should_compile = false

        watched_files[file] = new_mtime

        fnCompileFile file if should_compile
    )

# Compiles a file using `command`.
#
# Compilation errors are printed out to stdout.
exports.compileFile = (command, file, fnGetOutputfile) ->
    execute(command, (error, stdout, stderr) ->
        if error isnt null
            console.log error.message
        else
            output_filename = fnGetOutputfile(file)
            fs.writeFile(output_filename, stdout.toString(), (err) ->
                throw err if err
                console.log "Compiled #{file} to #{output_filename}"
            )
    )


# Starts a poller that polls each second in a directory
exports.startDirectoryPoll = (dir, fnFindFiles) ->
    directoryPoll = -> fnFindFiles(dir)
    directoryPoll()
    setInterval directoryPoll, 1000
