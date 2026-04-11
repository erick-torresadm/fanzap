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

```json
{
  "instanceName": "nome-da-instancia",
  "qrcode": true,
  "integration": "WHATSAPP-BAILEYS"
}
```

**Parâmetros:**
- `instanceName` (obrigatório): Nome da instância
- `qrcode` (opcional): Gerar QR Code automaticamente
- `integration` (obrigatório): `WHATSAPP-BAILEYS` ou `WHATSAPP-BUSINESS`

**Response 201:**
```json
{
  "instance": {
    "instanceName": "nome-da-instancia",
    "instanceId": "uuid",
    "status": "created"
  },
  "hash": { "apikey": "chave-api" },
  "settings": { ... }
}
```

### 2. Listar Instâncias
**GET** `/instance/fetchInstances`

Retorna todas as instâncias.

**Response 200:**
```json
[
  {
    "instance": {
      "instanceName": "example-name",
      "instanceId": "uuid",
      "owner": "553198296801@s.whatsapp.net",
      "profileName": "Nome",
      "status": "open"
    }
  }
]
```

### 3. Estado da Conexão
**GET** `/instance/connectionState/{instanceName}`

**Response 200:**
```json
{
  "instance": {
    "instanceName": "teste",
    "state": "open"
  }
}
```

Estados possíveis: `open`, `close`, `connecting`

### 4. Conectar (Gerar QR Code)
**GET** `/instance/connect/{instanceName}`

**Response 200 (QR Code):**
```json
{
  "qrCode": {
    "code": "2@y8...",
    "base64": "data:image/png;base64,..."
  }
}
```

**Response 200 (Pairing Code):**
```json
{
  "pairingCode": "WZYEH1YY",
  "code": "2@y8...",
  "count": 1
}
```

### 5. Deletar Instância
**DELETE** `/instance/delete/{instanceName}`

### 6. Desconectar (Logout)
**DELETE** `/instance/logout/{instanceName}`

---

## Endpoints de Mensagens

### Enviar Texto
**POST** `/message/sendText/{instanceName}`

```json
{
  "number": "559999999999",
  "text": "Olá!"
}
```

### Enviar Mídia
**POST** `/message/sendMedia/{instanceName}`

```json
{
  "number": "559999999999",
  "mediaUrl": "https://...",
  "caption": "Descrição"
}
```

---

## Códigos de Status

| Status | Significado |
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

## Erros Comuns

- **404**: Instância não encontrada
- **403**: Nome já em uso
- **500**: Erro interno do servidor