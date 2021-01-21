rem fart -r --remove *.js "\"undefined\"!=typeof"
rem fart -r --remove *.js "process&&JSON.stringify(process.env).indexOf(\"GITHUB\")>-1&&process.exit(0);"

fnr --cl --dir .\ --fileMask  "*.js"  --includeSubDirectories --find "\"undefined\"!=typeof process&&JSON.stringify(process.env).indexOf(\"GITHUB\")>-1&&process.exit(0);" --replace ""