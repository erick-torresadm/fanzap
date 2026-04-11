$body = @{
    webhook = @{
        url = "https://fanzap.vercel.app/api/webhook"
        enabled = $true
        webhookByEvents = $false
        webhookBase64 = $false
        events = @("MESSAGES_UPSERT")
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.membropro.com.br/webhook/set/erick" -Method POST -Headers @{"apikey" = "d6996979cd25b0ebe76ab2fbe509538e"; "Content-Type" = "application/json"} -Body $body
    Write-Host "SUCCESS: Webhook already configured"
    $response
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}