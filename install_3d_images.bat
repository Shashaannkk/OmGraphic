@echo off
echo OM GRAPHICS - Copying 3D AI-Generated Images to Assets...
echo.

set "SRC=C:\Users\Shashank Poojari\.gemini\antigravity-ide\brain\adfabd1c-2d40-4192-83ea-5ecf42f740b0"
set "DST=C:\Users\Shashank Poojari\Documents\Printing website\Assets"

copy /Y "%SRC%\hero_printing_press_1783403652514.png"   "%DST%\hero-3d-press.png"
copy /Y "%SRC%\komori_lithrone_426_1783403665053.png"   "%DST%\machine-komori-426-3d.png"
copy /Y "%SRC%\komori_lithrone_28_1783403688941.png"    "%DST%\machine-komori-28-3d.png"
copy /Y "%SRC%\xerox_docucolor_digital_1783403703558.png" "%DST%\machine-digital-3d.png"
copy /Y "%SRC%\kodak_ctp_prepress_1783403726839.png"    "%DST%\machine-ctp-3d.png"
copy /Y "%SRC%\shoei_folding_machine_1783403738179.png" "%DST%\machine-folding-3d.png"
copy /Y "%SRC%\polar_cutting_machine_1783403758369.png" "%DST%\machine-cutting-3d.png"
copy /Y "%SRC%\services_printing_overview_1783403779286.png" "%DST%\services-overview-3d.png"
copy /Y "%SRC%\portfolio_brochures_1783403790732.png"   "%DST%\portfolio-brochures-3d.png"

echo.
echo Done! All 3D images copied to Assets folder.
echo Please open index.html in your browser to see the result.
pause
