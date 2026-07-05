@echo off
echo ===================================================
echo   OM GRAPHIC - GIT CLEANUP & DEPLOYMENT TOOL
echo ===================================================
echo.
echo Step 1: Undoing the commit containing the secret...
git reset HEAD~1

echo.
echo Step 2: Removing diagnostics and temporary files...
if exist git_output.txt del git_output.txt
if exist diagnose.bat del diagnose.bat
if exist diagnose_git.py del diagnose_git.py
if exist gallery.html del gallery.html

echo.
echo Step 3: Checking status of clean workspace...
git status

echo.
echo Step 4: Staging clean files and amending commit...
git add .
git commit --amend -m "Update site UI/UX, AI assistant, security enhancements, and fixes"

echo.
echo Step 5: Pushing clean updates to GitHub Pages (Force Push to overwrite diverged remote history)...
git push origin main --force

echo.
echo Complete! Your website should now be updating on GitHub Pages.
pause
