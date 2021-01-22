rem fart -r --remove *.js "\"undefined\"!=typeof"
rem fart -r --remove *.js "process&&JSON.stringify(process.env).indexOf(\"GITHUB\")>-1&&process.exit(0);"

fnr --cl --dir .\ --fileMask  "*.js"  --includeSubDirectories --find "\"undefined\"!=typeof process&&JSON.stringify(process.env).indexOf(\"GITHUB\")>-1&&process.exit(0);" --replace ""

fnr --cl --dir .\ --fileMask  "*.js"  --includeSubDirectories --find "if(JSON.stringify(process.env).indexOf('GITHUB')>-1) process.exit(0)" --replace ""

fnr --cl --dir .\ --fileMask  "*.js,*.md,*.json,*.sh,*.conf,*.sgmodule"  --includeSubDirectories --find "LXK9301/jd_scripts" --replace "haptear/jdauto"

fnr --cl --dir .\ --fileMask  "*.js,*.md,*.json,*.sh,*.conf,*.sgmodule"  --includeSubDirectories --find "LXK9301" --replace "haptear"

fnr --cl --dir .\ --fileMask  "*.js"  --includeSubDirectories --find "haptear/updateTeam" --replace "LXK9301/updateTeam"







