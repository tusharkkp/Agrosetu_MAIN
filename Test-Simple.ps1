# Simple test script
Write-Host "Starting simple test..." -ForegroundColor Green

try {
    Write-Host "Inside try block" -ForegroundColor Yellow
    Write-Host "Test completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Script finished. Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
