rem 先把.github目录设置未隐藏，这样xcopy就不会拷贝.git 和 .github目录
rem git pull
del jdCookie.js
del sendNotify.js

cd ..\jdauto
del jd*.js /Q
del jd*.ts /Q
xcopy ..\jdCookie.js .\  /Y

cd ..\jd_scripts_JDHelloWorld
xcopy *  ..\jdauto\  /E /Y

rem 编译ts
cd ..\jdauto
call tsc --build tsconfig.json

cd ..\genyml
call run.bat

cd ..\jdauto
clear.bat