<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing you code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# IMPORTANT: Evolution API Integration

Before making ANY changes related to the Evolution API (instances, messages, webhooks), you MUST:

1. Read the complete documentation in: `EVOLUTION_API_INTEGRATION.md`
2. Check the official docs at: https://doc.evolution-api.com/llms.txt

## Common Issues and Solutions

### Instance Not Found (404)
- Use instance NAME, not UUID for `/instance/connect/{name}`
- Instance may not exist in the Evolution API

### Error 500 on Instance Details
- The `/instance/connectionState/{name}` endpoint fails for disconnected instances
- ALWAYS use `/instance/fetchInstances` and filter by name as fallback

### QR Code Issues
- Use `base64` field for image display
- QR code expires; reconnect if needed

### Phone Numbers
- Always strip non-digits: `number.replace(/\D/g, '')`
- Include country code (55 for Brazil)

### Status Values
- `connectionStatus: "open"` = connected
- `connectionStatus: "close"` = disconnected
- `connectionStatus: "connecting"` = connecting

## Key Endpoints

- **Create instance**: POST `/instance/create` → `{ instanceName, qrcode: true, integration: "WHATSAPP-BAILEYS" }`
- **List instances**: GET `/instance/fetchInstances`
- **Get QR code**: GET `/instance/connect/{instanceName}`
- **Get status**: GET `/instance/connectionState/{instanceName}` (but use fetchInstances as fallback)
- **Send text**: POST `/message/sendText/{instanceName}` → `{ number, text }`
- **Send media**: POST `/message/sendMedia/{instanceName}` → `{ number, mediaUrl, caption }`

## Testing

- Use `/teste` page for manual testing
- Test number: 11948333534
