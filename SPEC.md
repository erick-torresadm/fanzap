# Especificação Técnica - Fanzap Bot SaaS

## Arquitetura

### Sistema Atual (Problema)
- Usuário precisa criar instância manualmente no painel admin da Evolution API
- Precisa configurar webhook manualmente
- Não é automatizado para clientes SaaS

### Sistema Novo (Solução)
- Cliente clica em "Conectar WhatsApp" 
- Sistema cria instância automaticamente na Evolution API do admin
- Sistema configura webhook automaticamente
- Cliente pode usar comandos como !pix para acionar fluxos

## Funcionalidades

### 1. Criação Automática de Instâncias
- POST /api/instances/connect - Cria instância + configura webhook automaticamente
- QR code gerado automaticamente
- polling para verificar conexão

### 2. Sistema de Comandos
- Commands armazenados no banco
- Trigger identifica comandos (ex: !pix)
- Executa sequência/fluxo associado

### 3. Fluxo do Cliente
1. Cliente acessa /dashboard
2. Clica "Conectar WhatsApp"
3. Escaneia QR code
4. Sistema detecta conexão → configura webhook automaticamente
5. Cliente pode usar comandos

## APIs Necessárias

### POST /api/instances/connect
```json
{
  "userId": "uuid",
  "instanceName": "cliente-001"
}
```

Resposta:
```json
{
  "qrCode": "base64...",
  "instanceName": "cliente-001",
  "status": "connecting"
}
```

### GET /api/instances/[name]/status
Verifica se instância conectou

### POST /api/webhook (já existe)
Detecta mensagens e executa comandos

## Banco de Dados

### Tabela commands
```sql
CREATE TABLE commands (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  command VARCHAR(50) NOT NULL,  -- !pix, !suporte, !oi
  sequence_id UUID,
  flow_id UUID,
  is_active BOOLEAN DEFAULT true
);
```

## Segurança
- Apenas o admin (usuário master) pode criar instâncias na Evolution API
- Clientes usam instâncias compartilhadas do admin
- Isolamento por user_id nas tabelas

## Deploy
- Testar localmente primeiro
- depois fazer deploy para Vercel