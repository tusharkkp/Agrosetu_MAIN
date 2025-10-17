#Requires -Version 5.1
<#
.SYNOPSIS
    AgroSetu Safe Startup Script - Handles execution policy issues
.DESCRIPTION
    This is a wrapper script that ensures the main AgroSetu script runs properly
    even with restrictive PowerShell execution policies.
.EXAMPLE
    .\Start-AgroSetu-Safe.ps1
    Starts AgroSetu with proper execution policy handling
#>

# Set error action preference
$ErrorActionPreference = "Continue"

# Function to pause and wait for user input
function Wait-ForUserInput {
    param([string]$Message = "Press any key to continue...")
    Write-Host "`n$Message" -ForegroundColor Gray
    try {
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    } catch {
        # Fallback if ReadKey fails
        Read-Host "Press Enter to continue"
    }
}

# Function to check execution policy
function Get-ExecutionPolicyStatus {
    $CurrentPolicy = Get-ExecutionPolicy
    Write-Host "Current PowerShell Execution Policy: $CurrentPolicy" -ForegroundColor Yellow
    
    if ($CurrentPolicy -eq "Restricted") {
        Write-Host "⚠️  Execution Policy is Restricted. This may prevent script execution." -ForegroundColor Red
        return $false
    } elseif ($CurrentPolicy -eq "AllSigned" -or $CurrentPolicy -eq "RemoteSigned") {
        Write-Host "⚠️  Execution Policy may require script signing." -ForegroundColor Yellow
        return $false
    } else {
        Write-Host "✅ Execution Policy allows script execution." -ForegroundColor Green
        return $true
    }
}

# Main execution
try {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  AgroSetu Safe Startup Script" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check execution policy
    Write-Host "Checking PowerShell Execution Policy..." -ForegroundColor Blue
    $PolicyOK = Get-ExecutionPolicyStatus
    
    if (-not $PolicyOK) {
        Write-Host ""
        Write-Host "Attempting to run with execution policy bypass..." -ForegroundColor Yellow
        
        # Try to run the main script with execution policy bypass
        try {
            $MainScriptPath = Join-Path $PSScriptRoot "Start-AgroSetu.ps1"
            if (Test-Path $MainScriptPath) {
                Write-Host "Starting AgroSetu with execution policy bypass..." -ForegroundColor Green
                & powershell.exe -ExecutionPolicy Bypass -File $MainScriptPath @args
                $ExitCode = $LASTEXITCODE
                
                if ($ExitCode -eq 0) {
                    Write-Host "AgroSetu started successfully!" -ForegroundColor Green
                } else {
                    Write-Host "AgroSetu encountered an error (Exit Code: $ExitCode)" -ForegroundColor Red
                }
            } else {
                Write-Host "Error: Main script not found at $MainScriptPath" -ForegroundColor Red
                Write-Host "Please ensure Start-AgroSetu.ps1 is in the same directory." -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Failed to run with execution policy bypass: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
            Write-Host "Manual Solution:" -ForegroundColor Yellow
            Write-Host "1. Open PowerShell as Administrator" -ForegroundColor White
            Write-Host "2. Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
            Write-Host "3. Type 'Y' when prompted" -ForegroundColor White
            Write-Host "4. Run this script again" -ForegroundColor White
        }
    } else {
        # Execution policy is fine, run normally
        Write-Host ""
        Write-Host "Running AgroSetu normally..." -ForegroundColor Green
        $MainScriptPath = Join-Path $PSScriptRoot "Start-AgroSetu.ps1"
        if (Test-Path $MainScriptPath) {
            & $MainScriptPath @args
        } else {
            Write-Host "Error: Main script not found at $MainScriptPath" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host ""
    Write-Host "An error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check the error details and try again." -ForegroundColor Yellow
} finally {
    Write-Host ""
    Wait-ForUserInput "Press any key to exit..."
}
