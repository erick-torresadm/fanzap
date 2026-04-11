# Fanzap - SaaS de Automação de WhatsApp

Plataforma SaaS para automação de WhatsApp com flow builder visual. Crie fluxos de atendimento e vendas com arrastar e soltar, conecte vários números de WhatsApp e deixe a automação trabalhar por você.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Vercel Postgres
- **Flow Builder**: @xyflow/react
- **State Management**: Zustand

## Getting Started

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra [http://localhost:3000](http://localhost:3000)

## Páginas

- `/` - Landing Page
- `/dashboard` - Dashboard principal
- `/instances` - Gerenciar instâncias WhatsApp
- `/flows` - Flow Builder visual
- `/sequences` - Sequências de mensagens
- `/triggers` - Gatilhos automáticos
- `/plans` - Planos e preços
- `/settings` - Configurações de conta

## Deploy na Vercel

1. Crie um projeto na Vercel
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente se necessário
4. Deploy automático

## Funcionalidades

- ✅ Flow Builder visual com drag & drop
- ✅ Múltiplas instâncias WhatsApp
- ✅ Conexão via QR Code
- ✅ Sequências de mensagens automatizadas
- ✅ Gatilhos por palavra-chave
- ✅ Dashboard com estatísticas
- ✅ Sistema de planos (Free, Básico, Pro, Enterprise)

## Estrutura do Banco de Dados

O schema do banco está em `src/lib/schema.sql`. Configure o Vercel Postgres e execute as queries para criar as tabelas.

## Licença

MIT