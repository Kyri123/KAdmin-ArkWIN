@echo off
echo -----------------------------------------
echo             UpdatePanel
echo -----------------------------------------
echo Downloading: https://github.com/Kyri123/ArkAdminWIN/archive/master.zip
powershell -command "& { iwr https://github.com/Kyri123/ArkAdminWIN/archive/master.zip -OutFile '%~dp0cache\panel.zip' }"
echo Expand-Archive: %CD%\cache\panel.zip
powershell -command "Expand-Archive -Force -LiteralPath '%~dp0cache\panel.zip' -DestinationPath '%~dp0cache'"

echo Delete some files
del %CD%\cache\ArkAdminWIN-master\Panel\app\config\app.json
del %CD%\cache\ArkAdminWIN-master\Panel\app\config\mysql.json
del %CD%\cache\ArkAdminWIN-master\Panel\app\data\sha.txt
del %CD%\cache\ArkAdminWIN-master\Panel\app\json\server\5c68f48w.json
del %CD%\cache\ArkAdminWIN-master\Panel\app\json\server\5g28f48x.json
del %CD%\cache\ArkAdminWIN-master\Panel\public\json\serverInfos\auslastung.json

echo Installing...
xcopy /K /D /H /Y %CD%\cache\ArkAdminWIN-master\Panel %CD%

echo remove cache files
rmdir %CD%\cache\ArkAdminWIN-master /s /q
del %CD%\cache\panel.zip

echo Done!

echo -----------------------------------------
echo        Update Module + Start
echo -----------------------------------------
npm i & npm update & npm fund & start "ArkAdminWIN 0.0.1" cmd /k "node app.js startedWithUpdater & start "ArkAdminWIN Starter" start_master.cmd & exit" & exit