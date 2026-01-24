cd "C:\Dev"
mkdir "animation_temp"
cd "animation_temp"  || GOTO :Failure

set FILENAME=C:\Users\ericl\Downloads\?*.tar
"C:\Program Files\7-Zip\7z" e %FILENAME% -y 

for %%i in (%FILENAME%) do echo %%~ni > fr.txt
set /p FR=<fr.txt

magick identify -format "%%w" 0000000.png > width.txt
set /p WIDTH=<width.txt
magick identify -format "%%h" 0000000.png > height.txt
set /p HEIGHT=<height.txt

"ffmpeg" -y -r %FR% -f image2 -i "%%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p C:\Users\ericl\Downloads\output.mp4

"C:\Dev\gifski\win\gifski.exe" --fps %FR% --width %WIDTH% --height %HEIGHT% -o C:\Users\ericl\Downloads\output.gif *.png  || GOTO :Failure

cd ..\

rd "animation_temp" /s /q

del %FILENAME%

EXIT

:Failure
echo Unable to process, not deleting anything, exiting...
pause 
EXIT