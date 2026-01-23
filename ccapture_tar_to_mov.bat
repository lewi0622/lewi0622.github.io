cd "C:\Dev"
mkdir "animation_temp"
cd "animation_temp"  || GOTO :Failure

set FILENAME=C:\Users\ericl\Downloads\?*.tar
"C:\Program Files\7-Zip\7z" e %FILENAME% -y 

for %%i in (%FILENAME%) do echo %%~ni > fr.txt
set /p FR=<fr.txt

"ffmpeg" -y -r %FR% -f image2 -i "%%07d.png" -c:v prores -pix_fmt yuva444p10le C:\Users\ericl\Downloads\output.mov

cd ..\

rd "animation_temp" /s /q

del %FILENAME%

EXIT

:Failure
echo Unable to go to animation_temp folder, exiting...
pause >nul
EXIT