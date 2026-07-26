# Deploy the AppealMate security fix to the LIVE Netlify site.
# Run this the moment Netlify deploys are un-blocked (credits reset / added).
# It is idempotent and self-verifying. The fix is already written+committed to
# netlify/functions/verify.js, create-checkout.js (session_id + open-redirect),
# and public/app.js (server-side unlock verification).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security

# Decrypt the Netlify token (DPAPI, CurrentUser)
$h = (Get-Content 'C:\Users\benja\every-pound\.secrets\netlify_token.dpapi' -Raw).Trim()
$b = [byte[]]::new($h.Length/2); for ($i=0; $i -lt $b.Length; $i++) { $b[$i] = [Convert]::ToByte($h.Substring($i*2,2),16) }
$env:NETLIFY_AUTH_TOKEN = [Text.Encoding]::Unicode.GetString([Security.Cryptography.ProtectedData]::Unprotect($b,$null,'CurrentUser')).Trim()

$site = '2eaf1fe0-3fbd-47f2-9090-e0e13aab87dd'   # appealmate-uk

# Pre-flight: is Netlify still blocked?
try {
  Invoke-RestMethod -Method Post -Uri "https://api.netlify.com/api/v1/sites/$site/deploys" -Headers @{Authorization="Bearer $($env:NETLIFY_AUTH_TOKEN)"} -ContentType 'application/json' -Body '{"files":{}}' | Out-Null
} catch {
  $body = $_.ErrorDetails.Message
  if ($body -match 'credit usage exceeded') { Write-Host "STILL BLOCKED - Netlify credits not reset yet. Try again later."; exit 1 }
}

Set-Location 'C:\Users\benja\appealmate'
Write-Host "Deploying fix to LIVE appealmate.uk ..."
npx --yes netlify-cli deploy --dir=public --functions=netlify/functions --site=$site --prod --message "security: server-side payment verify + close open-redirect"

Write-Host "`n--- Verifying live gate ---"
Start-Sleep 5
$fake = Invoke-WebRequest -Uri "https://appealmate.uk/.netlify/functions/verify?session_id=cs_live_fake000" -SkipHttpErrorCheck
Write-Host "verify fake session -> HTTP $($fake.StatusCode) (expect 502 = rejected)"
Write-Host "DONE. If 502, the free-letter hole is closed on the live site."
