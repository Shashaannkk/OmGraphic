# Run this script to copy all portfolio & service images into the website Assets folder
$src = "C:\Users\Shashank Poojari\.gemini\antigravity-ide\brain\005573f6-48ce-4862-b70c-43a09214c28a"
$dst = "C:\Users\Shashank Poojari\Documents\Printing website\Assets\portfolio"

if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst -Force | Out-Null }

$map = @{
    "portfolio_catalogue_1783262822845.png"   = "portfolio_catalogue.png"
    "portfolio_cartons_1783262834583.png"     = "portfolio_cartons.png"
    "portfolio_calendar_1783262845807.png"    = "portfolio_calendar.png"
    "portfolio_blister_1783262863379.png"     = "portfolio_blister.png"
    "portfolio_shade_cards_1783262875100.png" = "portfolio_shade_cards.png"
    "portfolio_folders_1783262885913.png"     = "portfolio_folders.png"
    "portfolio_visual_aids_1783262904827.png" = "portfolio_visual_aids.png"
    "portfolio_invitations_1783262915073.png" = "portfolio_invitations.png"
    "portfolio_danglers_1783262926825.png"    = "portfolio_danglers.png"
    "services_offset_press_1783262946332.png" = "services_offset_press.png"
    "services_brochures_1783262958240.png"    = "services_brochures.png"
    "services_packaging_1783262968843.png"    = "services_packaging.png"
    "service_books_1783263247059.png"         = "service_books.png"
    "service_stationery_1783263257785.png"    = "service_stationery.png"
    "service_posm_1783263268541.png"          = "service_posm.png"
}

foreach ($key in $map.Keys) {
    $srcFile = Join-Path $src $key
    $dstFile = Join-Path $dst $map[$key]
    if (Test-Path $srcFile) {
        [System.IO.File]::Copy($srcFile, $dstFile, $true)
        Write-Host "Copied: $($map[$key])"
    } else {
        Write-Warning "Not found: $srcFile"
    }
}

Write-Host "`nAll done! Images are now in: $dst"
