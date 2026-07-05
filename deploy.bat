@echo off
echo Committing and Deploying to GitHub Pages...
git add .
git commit -m "Update site UI/UX, AI assistant, security enhancements, and fixes"
git push origin main
echo Pushed to GitHub!
pause
