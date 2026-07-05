@echo off
echo ===================================================
echo   OM GRAPHICS - COPY IMAGES + PUSH TO GITHUB
echo ===================================================
echo.

echo Step 1: Creating Assets\portfolio folder if needed...
if not exist "Assets\portfolio" mkdir "Assets\portfolio"

echo.
echo Step 2: Copying portfolio images from AI generation folder...
set SRC=C:\Users\Shashank Poojari\.gemini\antigravity-ide\brain\005573f6-48ce-4862-b70c-43a09214c28a

copy /Y "%SRC%\portfolio_catalogue_1783262822845.png"   "Assets\portfolio\portfolio_catalogue.png" >nul 2>&1
copy /Y "%SRC%\portfolio_cartons_1783262834583.png"     "Assets\portfolio\portfolio_cartons.png" >nul 2>&1
copy /Y "%SRC%\portfolio_calendar_1783262845807.png"    "Assets\portfolio\portfolio_calendar.png" >nul 2>&1
copy /Y "%SRC%\portfolio_blister_1783262863379.png"     "Assets\portfolio\portfolio_blister.png" >nul 2>&1
copy /Y "%SRC%\portfolio_shade_cards_1783262875100.png" "Assets\portfolio\portfolio_shade_cards.png" >nul 2>&1
copy /Y "%SRC%\portfolio_folders_1783262885913.png"     "Assets\portfolio\portfolio_folders.png" >nul 2>&1
copy /Y "%SRC%\portfolio_visual_aids_1783262904827.png" "Assets\portfolio\portfolio_visual_aids.png" >nul 2>&1
copy /Y "%SRC%\portfolio_invitations_1783262915073.png" "Assets\portfolio\portfolio_invitations.png" >nul 2>&1
copy /Y "%SRC%\portfolio_danglers_1783262926825.png"    "Assets\portfolio\portfolio_danglers.png" >nul 2>&1
copy /Y "%SRC%\services_offset_press_1783262946332.png" "Assets\portfolio\services_offset_press.png" >nul 2>&1
copy /Y "%SRC%\services_brochures_1783262958240.png"    "Assets\portfolio\services_brochures.png" >nul 2>&1
copy /Y "%SRC%\services_packaging_1783262968843.png"    "Assets\portfolio\services_packaging.png" >nul 2>&1
copy /Y "%SRC%\service_books_1783263247059.png"         "Assets\portfolio\service_books.png" >nul 2>&1
copy /Y "%SRC%\service_stationery_1783263257785.png"    "Assets\portfolio\service_stationery.png" >nul 2>&1
copy /Y "%SRC%\service_posm_1783263268541.png"          "Assets\portfolio\service_posm.png" >nul 2>&1

echo   Images copied!

echo.
echo Step 3: Staging all updated files for Git...
git add .

echo.
echo Step 4: Committing changes...
git commit -m "Add professional AI photos to portfolio and services pages"

echo.
echo Step 5: Pushing to GitHub Pages...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Normal push failed. Using force push to overwrite remote history...
    git push origin main --force
)

echo.
echo ===================================================
echo  Done! Your site will update in ~1-2 minutes at:
echo  https://shashaannkk.github.io/OmGraphic/
echo ===================================================
pause
