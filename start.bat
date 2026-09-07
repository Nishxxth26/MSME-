@echo off
set "PATH=C:\Windows\System32;C:\Windows;C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%"
title EcoCart Platform Launcher
echo ===================================================
echo           Starting EcoCart MSME Platform
echo ===================================================
echo.
echo 1. Launching Backend API Server on Port 5000...
start "EcoCart Backend (Port 5000)" cmd /k "set PATH=C:\Windows\System32;C:\Program Files\nodejs;C:\Program Files\Git\cmd;%%PATH%% && cd /d e:\msme\server && npm start"

echo 2. Launching Frontend Vite Client on Port 5173...
start "EcoCart Frontend (Port 5173)" cmd /k "set PATH=C:\Windows\System32;C:\Program Files\nodejs;C:\Program Files\Git\cmd;%%PATH%% && cd /d e:\msme\client && npm run dev"

echo.
echo ===================================================
echo EcoCart services launched!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:5000/api/health
echo ===================================================
echo.
pause
