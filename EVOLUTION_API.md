# Evolution API v2 - Documentação Completa

## Base URL
```
https://api.membropro.com.br
```

## Autenticação
- Header: `apikey: d6996979cd25b0ebe76ab2fbe509538e`
- Content-Type: `application/json`

---

## Endpoints de Instâncias

### 1. Criar Instância
**POST** `/instance/create`

Request:
```json
{
  "instanceName": "nome-instancia",
  "qrcode": true,
  "integration": "WHATSAPP-BAILEYS"
}
```

Response 201:
```json
{
  "instance": {
    "instanceName": "nome-instancia",
    "instanceId": "uuid",
    "status": "created"
  },
  "hash": { "apikey": "chave-api" },
  "settings": { ... }
}
```

### 2. Listar Instâncias
**GET** `/instance/fetchInstances`

Response 200:
```json
[
  {
    "instance": {
      "instanceName": "nome",
      "instanceId": "uuid",
      "owner": "559999999999@s.whatsapp.net",
      "profileName": "Nome",
      "status": "open"
    }
  }
]
```

### 3. Estado da Conexão
**GET** `/instance/connectionState/{instanceName}`

Response 200:
```json
{
  "instance": {
    "instanceName": "nome",
    "state": "open"  // open, close, connecting
  }
}
```

### 4. Conectar (QR Code)
**GET** `/instance/connect/{instanceName}`

Response 200 (QR Code):
```json
{
  "qrCode": {
    "code": "2@y8...",
    "base64": "data:image/png;base64,..."
  }
}
```

Response 200 (Pairing Code):
```json
{
  "pairingCode": "WZYEH1YY",
  "code": "2@y8...",
  "count": 1
}
```

### 5. Deletar Instância
**DELETE** `/instance/delete/{instanceName}`

### 6. Logout (Desconectar)
**DELETE** `/instance/logout/{instanceName}`

---

## Endpoints de Mensagens

### Enviar Texto
**POST** `/message/sendText/{instanceName}`

Request:
```json
{
  "number": "559999999999",
  "text": "Olá mundo!",
  "delay": 1000  // ms antes de enviar
}
```

Response 201:
```json
{
  "key": {
    "remoteJid": "559999999999@s.whatsapp.net",
    "fromMe": true,
    "id": "BAE123456789"
  },
  "message": { "extendedTextMessage": { "text": "Olá mundo!" } },
  "messageTimestamp": "1717689097",
  "status": "PENDING"
}
```

### Enviar Mídia (Imagem, Vídeo, Áudio, Documento)
**POST** `/message/sendMedia/{instanceName}`

Request:
```json
{
  "number": "559999999999",
  "media": "https://exemplo.com/imagem.jpg",
  "mediatype": "image",
  "mimetype": "image/jpeg",
  "caption": "Descrição da imagem",
  "fileName": "imagem.jpg"
}
```

### Enviar Áudio
**POST** `/message/sendAudio/{instanceName}`

Request:
```json
{
  "number": "559999999999",
  "audio": "https://exemplo.com/audio.mp3"
}
```

### Enviar Buttons
**POST** `/message/sendButtons/{instanceName}`

Request:
```json
{
  "number": "559999999999",
  "title": "Escolha uma opção",
  "buttons": [
    { "buttonId": "1", "buttonText": "Opção 1" },
    { "buttonId": "2", "buttonText": "Opção 2" }
  ]
}
```

### Enviar Lista
**POST** `/message/sendList/{instanceName}`

Request:
```json
{
  "number": "559999999999",
  "title": "Título",
  "text": "Descrição",
  "buttonText": "Ver opções",
  "sections": [
    {
      "title": "Seção 1",
      "rows": [
        { "id": "1", "title": "Opção 1", "description": "Descrição 1" }
      ]
    }
  ]
}
```

### Enviar Localização
**POST** `/message/sendLocation/{instanceName}`

Request:
```json
{
  "number": "559999999999",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "title": "Local"
}
```

---

## Endpoints de Chat

### Listar Conversas
**POST** `/chat/findChats/{instanceName}`

Response:
```json
[
  {
    "id": { "remoteJid": "559999999999@s.whatsapp.net" },
    "name": "Nome",
    "unreadCount": 0,
    "lastMessage": { ... }
  }
]
```

### Buscar Mensagens
**POST** `/chat/findMessages/{instanceName}`

Request:
```json
{
  "where": {
    "key": {
      "remoteJid": "559999999999@s.whatsapp.net"
    }
  }
}
```

### Arquivar Chat
**POST** `/chat/archiveChat/{instanceName}`

Request:
```json
{
  "archive": true,
  "key": { "remoteJid": "559999999999@s.whatsapp.net" }
}
```

---

## Endpoints de Contatos

### Buscar Contatos
**POST** `/chat/findContacts/{instanceName}`

### Buscar Foto de Perfil
**GET** `/chat/fetchProfilePictureUrl/{instanceName}?number=559999999999`

---

## Endpoints de Grupos

### Criar Grupo
**POST** `/group/createGroup/{instanceName}`

Request:
```json
{
  "subject": "Nome do Grupo",
  "participants": ["559999999999", "558888888888"]
}
```

### Buscar Grupos
**GET** `/group/fetchAllGroups/{instanceName}`

### Sair do Grupo
**DELETE** `/group/leave/{instanceName}`

### Atualizar Membros
**PUT** `/group/updateParticipant/{instanceName}`

Request:
```json
{
  "action": "add",  // add, remove, promote, demote
  "participants": ["559999999999"],
  "groupJid": "group-id@g.us"
}
```

---

## Endpoints de Webhook

### Configurar Webhook
**POST** `/webhook/instance/{instanceName}`

Request:
```json
{
  "enabled": true,
  "url": "https://seu-dominio.com/webhook",
  "webhookByEvents": false,
  "events": [
    "QRCODE_UPDATED",
    "MESSAGES_UPSERT",
    "MESSAGES_UPDATE",
    "CONNECTION_UPDATE"
  ]
}
```

### Buscar Webhook
**GET** `/webhook/find/{instanceName}`

---

## Eventos de Webhook

| Evento | Descrição |
|--------|------------|
| QRCODE_UPDATED | QR Code atualizado (envia base64) |
| MESSAGES_UPSERT | Nova mensagem recebida |
| MESSAGES_UPDATE | Mensagem atualizada |
| MESSAGES_DELETE | Mensagem deletada |
| SEND_MESSAGE | Mensagem enviada |
| CONNECTION_UPDATE | Status da conexão mudou |
| PRESENCE_UPDATE | Presença do usuário mudou |
| CHATS_UPSERT | Novo chat |
| CONTACTS_UPSERT | Novo contato |

### Payload MESSAGES_UPSERT:
```json
{
  "event": "MESSAGES_UPSERT",
  "instance": "nome-instancia",
  "data": {
    "key": {
      "remoteJid": "559999999999@s.whatsapp.net",
      "fromMe": false,
      "id": "xyz"
    },
    "message": {
      "conversation": "Olá!"
    },
    "messageTimestamp": "1717689097"
  }
}
```

---

## Códigos de Status

| Estado | Significado |
|--------|-------------|
| open | Conectado |
| close | Desconectado |
| connecting | Conectando |

---

## Headers Necessários
```javascript
{
  'Content-Type': 'application/json',
  'apikey': 'd6996979cd25b0ebe76ab2fbe509538e'
}
```

---

## Códigos de Erro

| Código | Significado |
|--------|-------------|
| 400 | Requisição inválida |
| 401 | Não autorizado |
| 404 | Não encontrado |
| 409 | Conflito (já existe) |
| 500 | Erro interno |

---

## Exemplos de Uso

### Criar instância e conectar:
```javascript
// 1. Criar
await fetch('/instance/create', {
  method: 'POST',
  body: JSON.stringify({ instanceName: 'meu-bot', qrcode: true })
})

// 2. Pegar QR Code
const { qrCode } = await fetch('/instance/connect/meu-bot')

// 3. Esperar conectar
setInterval(async () => {
  const { instance } = await fetch('/instance/connectionState/meu-bot')
  if (instance.state === 'open') console.log('Conectado!')
}, 3000)
```

### Enviar mensagem:
```javascript
await fetch('/message/sendText/meu-bot', {
  method: 'POST',
  body: JSON.stringify({
    number: '559999999999',
    text: 'Olá! Bem-vindo ao nosso sistema.'
  })
})
```