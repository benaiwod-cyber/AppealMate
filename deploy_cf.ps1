Add-Type -AssemblyName System.Security

$enc = Get-Content "$PSScriptRoot\.secrets\cloudflare_token.dpapi" -Raw
$bytes = [System.Convert]::FromHexString($enc.Trim())
$decBytes = [System.Security.Cryptography.ProtectedData]::Unprotect($bytes, $null, 'CurrentUser')
$env:CLOUDFLARE_API_TOKEN = [System.Text.Encoding]::Unicode.GetString($decBytes)
$env:CLOUDFLARE_ACCOUNT_ID = (Get-Content "$PSScriptRoot\.secrets\cloudflare_account_id.txt" -Raw).Trim()

Set-Location $PSScriptRoot
npx wrangler pages deploy _cf_build --project-name appealmate-cf --commit-dirty=true
