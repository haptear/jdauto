rem �Ȱ�.githubĿ¼����δ���أ�����xcopy�Ͳ��´��.git �� .githubĿ¼
rem git pull
del jdCookie.js
del sendNotify.js
rem ����ts

xcopy *  ..\jdauto\  /E /Y

cd ..\jdauto
call tsc --build tsconfig.json

cd ..\genyml
call run.bat

cd ..\jdauto
clear.bat