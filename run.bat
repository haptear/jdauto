rem �Ȱ�.githubĿ¼����δ���أ�����xcopy�Ͳ��´��.git �� .githubĿ¼
rem git pull
del jdCookie.js
del sendNotify.js

cd ..\jdauto
del jd*.js /Q
del jd*.ts /Q
xcopy ..\jdCookie.js .\  /Y

cd ..\jd_scripts_JDHelloWorld
xcopy *  ..\jdauto\  /E /Y

rem ����ts
cd ..\jdauto
call tsc --build tsconfig.json

cd ..\genyml
call run.bat

cd ..\jdauto
clear.bat