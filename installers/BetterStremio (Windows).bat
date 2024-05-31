@echo off

if not exist "%cd%\stremio.exe" (
    cd "%localAppData%\Programs\LNV\Stremio-4"
)

set "DESC=Plugin ^& Theme loader for Stremio"
set TARGET='%cd%\stremio.exe'
set WORKDIR='%cd%'
set SHORTCUT='%cd%\BetterStremio.lnk'
set BETTERSTREMIO="%cd%\BetterStremio"
set SARGS='--development --streaming-server'
set PWS=powershell.exe -ExecutionPolicy Bypass -NoLogo -NonInteractive -NoProfile
for /f %%i in ('%PWS% -C "[Environment]::GetFolderPath([Environment+SpecialFolder]::Desktop)"') do set DESKTOP=%%i

title BetterStremio Installer
echo %DESC%
echo:

if not exist "%cd%\stremio.exe" (
    echo Error: Couldn't find 'stremio.exe' file neither in the current directory nor in the local app data folder.
    echo Place this batch file into Stremio Folder before running!
    echo:
    pause
    goto :exit
)


:menu
echo Choose an option:
echo:
echo 1. Install (patch server.js and create a shortcut)
echo 2. Repair (patch server.js only)
echo 3. Uninstall (unpatch server.js)
echo 4. Exit
echo:
set /p option="Option: "

TASKKILL /F /IM stremio.exe 2>nul
cls
echo %DESC%
echo:

if "%option%"=="1" goto repair
if "%option%"=="2" goto repair
if "%option%"=="3" goto uninstall
if "%option%"=="4" goto exit


:repair
mkdir %BETTERSTREMIO% 2>nul
mkdir %BETTERSTREMIO%\fonts 2>nul
mkdir %BETTERSTREMIO%\plugins 2>nul
mkdir %BETTERSTREMIO%\themes 2>nul
%PWS% -Command "Invoke-WebRequest https://raw.githubusercontent.com/MateusAquino/BetterStremio/main/patch.js -OutFile %cd%\patch.js"
%PWS% -Command "Invoke-WebRequest https://raw.githubusercontent.com/MateusAquino/BetterStremio/main/BetterStremio.loader.js -OutFile %BETTERSTREMIO%\BetterStremio.loader.js"
%PWS% -Command "Invoke-WebRequest https://raw.githubusercontent.com/MateusAquino/BetterStremio/main/fonts/icon-full-height.ttf -OutFile %BETTERSTREMIO%\fonts\icon-full-height.ttf"
%PWS% -Command "Invoke-WebRequest https://raw.githubusercontent.com/MateusAquino/BetterStremio/main/fonts/icon-full-height.woff -OutFile %BETTERSTREMIO%\fonts\icon-full-height.woff"
%PWS% -Command "Invoke-WebRequest https://raw.githubusercontent.com/MateusAquino/BetterStremio/main/fonts/PlusJakartaSans.ttf -OutFile %BETTERSTREMIO%\fonts\PlusJakartaSans.ttf"
%PWS% -Command "(Get-Content -raw 'server.js') -replace '(?s)\/\* BetterStremio:start \*\/.*?\/\* BetterStremio:end \*\/ ', '' | Set-Content 'server.js'"
%PWS% -Command "(Get-Content -raw 'server.js') -replace '(?s)enginefs\.router\.get\(\"\/\"', ('{0} {1}' -f (Get-Content -raw 'patch.js'),' enginefs.router.get(\"/\"') | Set-Content 'server.js'"
del patch.js 2>nul

if "%option%"=="1" goto install

echo:
echo Repair complete.
echo:

pause
exit


:install
%PWS% -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut(%SHORTCUT%); $S.TargetPath = %TARGET%; $S.Arguments = %SARGS%; $S.WorkingDirectory = %WORKDIR%; $S.Save()"

echo Shortcut created successfully.
echo:

set /p "createDesktop=Do you want to create a copy of the shortcut on the desktop? (y/N): "
if /i "%createDesktop%"=="y" (
    copy BetterStremio.lnk "%DESKTOP%\BetterStremio.lnk" 2>nul
    echo Shortcut copy created on the desktop.
)

echo:
echo Installation finished.
pause
exit


:uninstall
@del BetterStremio.lnk 2>nul
@del "%DESKTOP%\BetterStremio.lnk" 2>nul

%PWS% -Command "(Get-Content -raw 'server.js') -replace '(?s)\/\* BetterStremio:start \*\/.*?\/\* BetterStremio:end \*\/ ', '' | Set-Content 'server.js'"

echo Server.js unpatched successfully.
echo:

echo Would you also like to delete BetterStremio folder?
set /p "deleteFolder=WARNING: This will remove all your installed themes and plugins (y/N): "
if /i "%deleteFolder%"=="y" (
    RD /S /Q %BETTERSTREMIO%
)

cls
echo %DESC%
echo:
echo Important: Manually delete any shortcut you have created for BetterStremio (taskbar, startmenu, ...) and recreate from the original Stremio executable.
echo:
echo BetterStremio uninstalled successfully.
echo You can now delete this installer.
echo:
pause


:exit
exit
