rem �Ȱ�.githubĿ¼����δ���أ�����xcopy�Ͳ��´��.git �� .githubĿ¼
rem git pull

del .git /S/Q/F
del .github /S/Q/F

xcopy *  ..\..\..\jdauto\  /E /Y

cd  ..\..\..\jdauto

clear.bat

cd ..\jd_scripts_new