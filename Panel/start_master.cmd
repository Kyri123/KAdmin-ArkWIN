@echo off

WHERE npm
IF %ERRORLEVEL% NEQ 0 ECHO command "npm" not found!
IF %ERRORLEVEL% NEQ 0 pause
IF %ERRORLEVEL% NEQ 0 exit

WHERE node
IF %ERRORLEVEL% NEQ 0 ECHO command "node" not found!
IF %ERRORLEVEL% NEQ 0 pause
IF %ERRORLEVEL% NEQ 0 exit

echo -----------------------------------------
echo             UpdatePanel
echo -----------------------------------------
echo Downloading: https://github.com/Kyri123/KAdmin-ArkWIN/archive/master.zip
powershell -command "& { iwr https://github.com/Kyri123/KAdmin-ArkWIN/archive/master.zip -OutFile '%~dp0cache\panel.zip' }"
echo Expand-Archive: %CD%\cache\panel.zip
powershell -command "Expand-Archive -Force -LiteralPath '%~dp0cache\panel.zip' -DestinationPath '%~dp0cache'"

echo Delete some files
del %CD%\cache\KAdmin-ArkWIN-master\Panel\app\config\app.json
del %CD%\cache\KAdmin-ArkWIN-master\Panel\app\config\mysql.json
del %CD%\cache\KAdmin-ArkWIN-master\Panel\app\data\sha.txt
del %CD%\cache\KAdmin-ArkWIN-master\Panel\app\json\server\5c68f48w.json
del %CD%\cache\KAdmin-ArkWIN-master\Panel\app\json\server\5g28f48x.json
del %CD%\cache\KAdmin-ArkWIN-master\Panel\public\json\serverInfos\auslastung.json

echo Installing...
xcopy /K /D /H /Y %CD%\cache\KAdmin-ArkWIN-master\Panel %CD%

echo remove cache files
rmdir %CD%\cache\KAdmin-ArkWIN-master /s /q
del %CD%\cache\panel.zip

echo Done!

echo -----------------------------------------
echo        Update Module + Start
echo -----------------------------------------
npm i & npm update & npm fund & start "KAdmin-ArkWIN" cmd /k "node app.js startedWithUpdater & start "KAdmin-ArkWIN Starter" start_master.cmd & exit" & exit