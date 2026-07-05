@echo off
echo Creating portfolio images folder...
if not exist "Assets\portfolio" mkdir "Assets\portfolio"

set SRC=C:\Users\Shashank Poojari\.gemini\antigravity-ide\brain\005573f6-48ce-4862-b70c-43a09214c28a

echo Copying portfolio images...
copy /Y "%SRC%\portfolio_catalogue_1783262822845.png"   "Assets\portfolio\portfolio_catalogue.png"
copy /Y "%SRC%\portfolio_cartons_1783262834583.png"     "Assets\portfolio\portfolio_cartons.png"
copy /Y "%SRC%\portfolio_calendar_1783262845807.png"    "Assets\portfolio\portfolio_calendar.png"
copy /Y "%SRC%\portfolio_blister_1783262863379.png"     "Assets\portfolio\portfolio_blister.png"
copy /Y "%SRC%\portfolio_shade_cards_1783262875100.png" "Assets\portfolio\portfolio_shade_cards.png"
copy /Y "%SRC%\portfolio_folders_1783262885913.png"     "Assets\portfolio\portfolio_folders.png"
copy /Y "%SRC%\portfolio_visual_aids_1783262904827.png" "Assets\portfolio\portfolio_visual_aids.png"
copy /Y "%SRC%\portfolio_invitations_1783262915073.png" "Assets\portfolio\portfolio_invitations.png"
copy /Y "%SRC%\portfolio_danglers_1783262926825.png"    "Assets\portfolio\portfolio_danglers.png"

echo Copying services images...
copy /Y "%SRC%\services_offset_press_1783262946332.png" "Assets\portfolio\services_offset_press.png"
copy /Y "%SRC%\services_brochures_1783262958240.png"    "Assets\portfolio\services_brochures.png"
copy /Y "%SRC%\services_packaging_1783262968843.png"    "Assets\portfolio\services_packaging.png"
copy /Y "%SRC%\service_books_1783263247059.png"         "Assets\portfolio\service_books.png"
copy /Y "%SRC%\service_stationery_1783263257785.png"    "Assets\portfolio\service_stationery.png"
copy /Y "%SRC%\service_posm_1783263268541.png"          "Assets\portfolio\service_posm.png"

echo.
echo ================================
echo All images copied successfully!
echo ================================
pause
