@echo off
echo 🔧 Fixing Frontend Issues...
echo.

cd /d "%~dp0IT_Project"

echo ✅ Clearing Vite cache...
rmdir /s /q node_modules\.vite 2>nul
rmdir /s /q .vite 2>nul

echo ✅ Cache cleared!
echo.
echo 🚀 Now restart your frontend with: npm run dev
echo.
pause
