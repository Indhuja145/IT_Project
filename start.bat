@echo off
echo Starting IT-MIS System...
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd IT_Project && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
