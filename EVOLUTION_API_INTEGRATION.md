# Fanzap - Evolution API Integration Guide

## Overview

**Fanzap** is a SaaS WhatsApp automation platform built with Next.js 16 + TypeScript + Tailwind CSS. It integrates with the **Evolution API** (api.membropro.com.br) to manage WhatsApp instances and send messages.

## Evolution API Base Configuration

```typescript
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';

const headers = {
  'Content-Type': 'application/json',
  'apikey': EVOLUTION_API_KEY,
};
```

## API Endpoints Reference

### 1. Instance Management

#### Create Instance
```http
POST ${BASE_URL}/instance/create
```
**Body:**
```json
{
  "instanceName": "my-instance",
  "qrcode": true,
  "integration": "WHATSAPP-BAILEYS"
}
```
**Response:**
```json
{
  "instance": {
    "instanceName": "my-instance",
    "instanceId": "uuid",
    "status": "connecting"
  },
  "qrcode": {
    "code": "2@...",
    "base64": "data:image/png;base64,..."
  }
}
```

#### Fetch All Instances
```http
GET ${BASE_URL}/instance/fetchInstances
```
**Response:**
```json
[
  {
    "id": "uuid",
    "name": "instance-name",
    "connectionStatus": "open|close|connecting",
    "ownerJid": "5511999999999@s.whatsapp.net",
    "profileName": "Contact Name",
    "profilePicUrl": "https://...",
    "integration": "WHATSAPP-BAILEYS",
    "number": "5511999999999",
    "createdAt": "2026-04-11T02:32:36.040Z",
    "updatedAt": "2026-04-11T02:32:36.040Z"
  }
]
```

#### Get QR Code (Connect Instance)
```http
GET ${BASE_URL}/instance/connect/{instanceName}
```
**Response:**
```json
{
  "qrCode": {
    "code": "2@...",
    "base64": "data:image/png;base64,..."
  },
  "code": "2@...",
  "pairingCode": "12345678"
}
```
Note: Either `qrCode` or `pairingCode` will be returned, not both.

#### Get Connection State
```http
GET ${BASE_URL}/instance/connectionState/{instanceName}
```
**Response:**
```json
{
  "instance": {
    "instanceName": "my-instance",
    "state": "open|close|connecting"
  }
}
```

#### Delete Instance
```http
DELETE ${BASE_URL}/instance/delete/{instanceName}
```

#### Logout Instance
```http
DELETE ${BASE_URL}/instance/logout/{instanceName}
```

### 2. Message Sending

#### Send Text
```http
POST ${BASE_URL}/message/sendText/{instanceName}
```
**Body:**
```json
{
  "number": "5511999999999",
  "text": "Hello!"
}
```

#### Send Media
```http
POST ${BASE_URL}/message/sendMedia/{instanceName}
```
**Body:**
```json
{
  "number": "5511999999999",
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Image caption",
  "fileName": "image.jpg"
}
```
Also supports: audio, video via same endpoint.

#### Send Buttons
```http
POST ${BASE_URL}/message/sendButtons/{instanceName}
```
**Body:**
```json
{
  "number": "5511999999999",
  "title": "Title",
  "bodyText": "Message body",
  "footer": "Footer text",
  "buttons": [
    { "id": "btn1", "title": "Button 1" },
    { "id": "btn2", "title": "Button 2" }
  ]
}
```

#### Send List
```http
POST ${BASE_URL}/message/sendList/{instanceName}
```
**Body:**
```json
{
  "number": "5511999999999",
  "title": "Title",
  "footer": "Footer",
  "buttonText": "Select",
  "sections": [
    {
      "title": "Section 1",
      "rows": [
        { "id": "1", "title": "Option 1", "description": "Desc" },
        { "id": "2", "title": "Option 2", "description": "Desc" }
      ]
    }
  ]
}
```

#### Send Location
```http
POST ${BASE_URL}/message/sendLocation/{instanceName}
```
**Body:**
```json
{
  "number": "5511999999999",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "title": "Location name"
}
```

### 3. Chat Management

#### Find Chats
```http
GET ${BASE_URL}/chat/findChats/{instanceName}
```

#### Find Messages
```http
POST ${BASE_URL}/chat/findMessages/{instanceName}
```
**Body:**
```json
{
  "where": {
    "key": "remoteJid",
    "value": "5511999999999@s.whatsapp.net"
  },
  "limit": 100
}
```

#### Mark Message as Read
```http
PUT ${BASE_URL}/chat/markAsRead/{instanceName}
```
**Body:**
```json
{
  "key": {
    "remoteJid": "5511999999999@s.whatsapp.net",
    "fromMe": true,
    "id": "message-id"
  }
}
```

### 4. Contact Management

#### Find Contacts
```http
GET ${BASE_URL}/contact/find/{instanceName}
```

#### Fetch Profile Picture
```http
GET ${BASE_URL}/contact/fetchProfilePictureUrl/{instanceName}?number=5511999999999
```

### 5. Group Management

#### Fetch All Groups
```http
GET ${BASE_URL}/group/fetchAllGroups/{instanceName}
```

#### Create Group
```http
POST ${BASE_URL}/group/create/{instanceName}
```
**Body:**
```json
{
  "subject": "Group Name",
  "participants": ["5511999999999@s.whatsapp.net"]
}
```

### 6. Webhooks

#### Set Webhook
```http
POST ${BASE_URL}/webhook/set/{instanceName}
```
**Body:**
```json
{
  "webhookUrl": "https://myapp.com/webhook",
  "webhookByEvents": true,
  "webhookEvents": [
    "QRCODE_UPDATED",
    "CONNECTION_UPDATE",
    "MESSAGES_UPSERT",
    "MESSAGES_UPDATE",
    "MESSAGES_DELETE"
  ]
}
```

#### Webhook Events Reference
- `QRCODE_UPDATED` - QR code changed
- `CONNECTION_UPDATE` - Instance connection state changed
- `MESSAGES_UPSERT` - New message received
- `MESSAGES_UPDATE` - Message updated (read, etc.)
- `MESSAGES_DELETE` - Message deleted
- `SEND_MESSAGE` - Message sent
- `CONTACTS_UPSERT` - Contact list updated

## Status Mapping

```typescript
const statusMap = {
  'open': 'connected',
  'close': 'disconnected',
  'connecting': 'connecting',
};
```

## Common Errors and Solutions

### Error 404 on QR Code
- Instance may not exist in Evolution API
- Solution: Use instance name (not UUID) for `/instance/connect/{name}`

### Error 500 on Instance Details
- The `/instance/connectionState/{name}` endpoint may fail for disconnected instances
- Solution: Use `/instance/fetchInstances` and filter by name

### QR Code Not Showing
- Check if instance exists: GET `/instance/fetchInstances`
- Instance must be in "connecting" state
- Use the `base64` field for QR code image

### Phone Number Format
Always remove non-digits:
```javascript
const cleanNumber = number.replace(/\D/g, '');
```

### Message Send Fails
- Instance must be connected (`connectionStatus: "open"`)
- Check if number is valid WhatsApp: GET `/chat/checkIsWhatsapp/{number}`

## Project API Routes

### GET /api/instances
Returns all instances from Evolution API.

### POST /api/instances
Creates new instance.
```json
{ "name": "my-instance" }
```

### GET /api/instances/[name]
Returns instance status by name.

### DELETE /api/instances/[name]
Deletes instance by name.

### GET /api/instances/[name]/qrcode
Returns QR code for connection.

### POST /api/messages/send
Sends text message.
```json
{
  "instanceName": "my-instance",
  "number": "11999999999",
  "text": "Hello!"
}
```

### POST /api/flows
Creates flow (stored in memory).

### POST /api/sequences
Creates message sequence.

### POST /api/sequences/execute
Executes sequence for a phone number.

### POST /api/webhook
Receives webhook events from Evolution API.

## Environment Variables

```
EVOLUTION_API_URL=https://api.membropro.com.br
EVOLUTION_API_KEY=d6996979cd25b0ebe76ab2fbe509538e
```

## Testing

Use the test page: `/teste`

Or direct API:
```bash
curl -X POST https://fanzap.vercel.app/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{"instanceName":"my-instance","number":"11999999999","text":"Hello!"}'
```

## Important Notes

1. **Instance Names vs UUIDs**: Always use instance NAME (not UUID) for most endpoints
2. **Connection State**: Use `/instance/fetchInstances` to get accurate status
3. **QR Code Expiry**: QR codes expire; reconnect if needed
4. **Phone Format**: Always use country code (55 for Brazil)
5. **Memory Storage**: Flows and sequences are stored in server memory (will reset on deployment)

## Portuguese (Resumo)

Este documento contém toda a documentação da integração com Evolution API:

- **URL Base**: `https://api.membropro.com.br`
- **Headers**: `{ "apikey": "d6996979cd25b0ebe76ab2fbe509538e" }`
- **Instâncias**: Criar via `/instance/create`, listar via `/instance/fetchInstances`
- **Conexão**: QR code via `/instance/connect/{name}`, estado via `/instance/connectionState/{name}`
- **Mensagens**: Texto via `/message/sendText/{name}`, mídia via `/message/sendMedia/{name}`
- **Erros Comuns**: 404 = instância não existe, 500 = problema na Evolution API

## Spanish (Resumen)

- **URL Base**: `https://api.membropro.com.br`
- **Cabeceras**: `{ "apikey": "d6996979cd25b0ebe76ab2fbe509538e" }`
- **Instancias**: Crear `/instance/create`, listar `/instance/fetchInstances`
- **Conexión**: QR code `/instance/connect/{name}`, estado `/instance/connectionState/{name}`
- **Mensajes**: Texto `/message/sendText/{name}`, media `/message/sendMedia/{name}`