rem 先把.github目录设置未隐藏，这样xcopy就不会拷贝.git 和 .github目录
git pull

xcopy *  ..\jdauto\  /E /Y

cd ..\jdauto

clear.bat

cd ..\jd_scripts_new