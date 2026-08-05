@echo off
title SportsFreunde - Wird gestartet...

echo.
echo   ==============================
echo     SportsFreunde - Web-App
echo   ==============================
echo.

:: Pfad zum Skript-Verzeichnis
cd /d "%~dp0"

:: Portable Node.js Konfiguration
set NODE_VERSION=20.18.1
set NODE_DIR=%~dp0node-portable
set NODE_EXE=%NODE_DIR%\node.exe
set NPM_CMD=%NODE_DIR%\npm.cmd
set NODE_ZIP=%~dp0node-portable.zip
set NODE_URL=https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-win-x64.zip
set NODE_EXTRACTED=node-v%NODE_VERSION%-win-x64

:: Pruefen ob portable Node.js vorhanden ist
if exist "%NODE_EXE%" (
    echo   [OK] Node.js gefunden
    goto :DEPS
)

echo   [..] Node.js wird heruntergeladen (einmalig, ca. 30 MB)...
echo        Version: v%NODE_VERSION%
echo.

:: Download mit PowerShell
powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_ZIP%' -UseBasicParsing }"

if not exist "%NODE_ZIP%" (
    echo.
    echo   [FEHLER] Download fehlgeschlagen.
    echo   Bitte Node.js manuell installieren: https://nodejs.org
    pause
    exit /b 1
)

echo   [..] Wird entpackt...
powershell -Command "& { Expand-Archive -Path '%NODE_ZIP%' -DestinationPath '%~dp0' -Force }"

:: Umbenenne entpackten Ordner
if exist "%~dp0%NODE_EXTRACTED%" (
    rename "%~dp0%NODE_EXTRACTED%" node-portable
)

:: ZIP aufräumen
del "%NODE_ZIP%" 2>nul

if exist "%NODE_EXE%" (
    echo   [OK] Node.js erfolgreich installiert
) else (
    echo   [FEHLER] Installation fehlgeschlagen.
    pause
    exit /b 1
)

:DEPS
:: PATH setzen damit node und npm gefunden werden
set PATH=%NODE_DIR%;%NODE_DIR%\node_modules\npm\bin;%PATH%

:: Pruefen ob node_modules vorhanden
if exist "%~dp0node_modules" (
    echo   [OK] Abhaengigkeiten vorhanden
    goto :START
)

echo   [..] Abhaengigkeiten werden installiert (einmalig)...
echo.
call "%NPM_CMD%" install --no-audit --no-fund
echo.

if exist "%~dp0node_modules" (
    echo   [OK] Abhaengigkeiten installiert
) else (
    echo   [FEHLER] npm install fehlgeschlagen.
    pause
    exit /b 1
)

:START
echo.
echo   [..] Server wird gestartet...
echo.
echo   ==============================
echo     App oeffnet sich gleich im
echo     Browser unter:
echo     http://localhost:3000
echo   ==============================
echo.
echo   Dieses Fenster NICHT schliessen!
echo   Zum Beenden: Strg+C druecken
echo.

:: Browser oeffnen nach kurzer Verzoegerung
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"

:: Server starten
call "%NPM_CMD%" run dev
