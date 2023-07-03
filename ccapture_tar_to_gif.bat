cd "C:\Users\lewi0\Desktop\Generative Art\to_gif"
set FILENAME=C:\Users\lewi0\Downloads\?*.tar
"C:\Program Files\7-Zip\7z" e %FILENAME% -y 

for %%i in (%FILENAME%) do echo %%~ni > fr.txt
set /p FR=<fr.txt

magick identify -format "%%w" 0000000.png > width.txt
set /p WIDTH=<width.txt
magick identify -format "%%h" 0000000.png > height.txt
set /p HEIGHT=<height.txt

"C:\Users\lewi0\Desktop\Generative Art\ffmpeg-5.0.1-full_build\ffmpeg-5.0.1-full_build\bin\ffmpeg.exe" -y -r %FR% -f image2 -i "%%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p C:\Users\lewi0\Downloads\output.mp4

"C:\Users\lewi0\Desktop\Generative Art\gifski-1.6.4\win\gifski.exe" --fps %FR% --width %WIDTH% --height %HEIGHT% -o C:\Users\lewi0\Downloads\output.gif *.png

del "*.*" /s /f /q

del %FILENAME%

EXIT