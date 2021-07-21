rem 先把.github目录设置未隐藏，这样xcopy就不会拷贝.git 和 .github目录
rem git pull
del jdCookie.js
del sendNotify.js
rem 编译ts

xcopy *  ..\jdauto\  /E /Y

cd ..\jdauto
call tsc --build tsconfig.json

cd ..\genyml
call run.bat

cd ..\jdauto
clear.bat