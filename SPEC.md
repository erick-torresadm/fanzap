# Fanzap - SaaS de Automação de WhatsApp

## 1. Visão Geral do Projeto

**Nome:** Fanzap  
**Tipo:** SaaS de Automação de WhatsApp com Flow Builder Visual  
**Propósito:** Plataforma para criar, gerenciar e vender automações de WhatsApp sem necessidade de acessar VPS manualmente para validar QR Code  
**Público-alvo:** Entrepreneurs,营销adores, pequenas empresas que precisam automatizar atendimento e vendas via WhatsApp

---

## 2. Arquitetura Técnica

### Stack
- **Frontend:** Next.js 14 (App Router) + React + TypeScript
- **Estilização:** Tailwind CSS + shadcn/ui
- **Database:** Vercel Postgres
- **Auth:** Clerk ou NextAuth (magia)
- **Drag & Drop:** React Flow ou @xyflow/react
- **Estado:** Zustand ou React Query

### Estrutura de Dados

```
Users (Clerk)
  └── Plans (free, basic, pro, enterprise)
  └── Instances (WhatsApp connections)
        └── Flows (automation flows)
        └── Sequences (message sequences)
        └── Triggers (event triggers)
```

---

## 3. Requisitos Funcionais

### 3.1 Sistema de Planos
- **Free:** 1 instância WhatsApp, 1 fluxo, 50 mensagens/mês
- **Basic:** 3 instâncias, 5 fluxos, 1000 mensagens/mês
- **Pro:** 10 instâncias, fluxos ilimitados, 10000 mensagens/mês
- **Enterprise:** instâncias ilimitadas, mensagens ilimitadas

### 3.2 Gestão de Instâncias
- Criar nova instância WhatsApp
- Conectar via QR Code (gerado no frontend, validado via API)
- Listar instâncias com status (conectada, desconectada, conectando)
- Desconectar/remover instância
- Ver último acesso

### 3.3 Flow Builder (Drag & Drop)
- Canvas visual com nodes arrastáveis
- Tipos de nós:
  - **Início** (trigger)
  - **Mensagem** (enviar texto, imagem, áudio, vídeo)
  - **Condição** (se... então... seno)
  - **Delay** (esperar X minutos/horas/dias)
  - **Webhook** (chamar API externa)
  - **Fim**
- Conexões visuais entre nós (linhas)
- Salvar/editar/duplicar fluxos
- Ativar/desativar fluxos
- Testar fluxo

### 3.4 Sequências de Mensagens
- Criar sequência com várias mensagens
- Definir intervalo entre mensagens
- Atribuir a um fluxo ou instance
- Visualizar status (enviadas, pendentes, falha)

### 3.5 Gatilhos (Triggers)
- Quando recebe mensagem do cliente
- Quando cliente envia palavra-chave
- Quando cliente entra em grupo (futuro)
- Ativar fluxo automaticamente via trigger

### 3.6 Dashboard
- Visão geral das instâncias
- Estatísticas de mensagens (enviadas, recebidas)
- Lista de fluxos recentes
- Ativações de hoje

---

## 4. Design System

### Identidade Visual
- **Nome:** Fanzap
- **Posicionamento:** Automação profissional mas acessível
- **Paleta de cores:** (a definir com designer)
- **Tipografia:** (a definir com designer)

### Páginas Principais
1. Landing Page (página de vendas)
2. Login/Register
3. Dashboard (padrão)
4. Lista de Instâncias
5. Flow Builder (核心)
6. Configurações de Conta
7. Planos e Billing (visual apenas, sem Stripe agora)

---

## 5. Cronograma de Implementação

### Fase 1: Foundation
- [ ] Setup Next.js + Tailwind + shadcn/ui
- [ ] Configurar Vercel Postgres e schemas
- [ ] Setup Auth (Clerk)
- [ ] Layout base e design system

### Fase 2: Instâncias
- [ ] CRUD de instâncias
- [ ] Conexão QR Code
- [ ] Status em tempo real

### Fase 3: Flow Builder
- [ ] Canvas React Flow
- [ ] Paleta de nós
- [ ] Editor de propriedades
- [ ] Salvar/editar fluxos

### Fase 4: Sequências & Triggers
- [ ] Criar sequências
- [ ] Configurar triggers
- [ ] Execução de fluxos

### Fase 5: Dashboard & UI
- [ ] Dashboard com métricas
- [ ] Páginas de configurações
- [ ] Landing page

---

## 6. Considerações Importantes

1. **QR Code:** A lib do Pedro Lopez gera QR code no servidor - we'll need API routes para gerar e validar
2. **Mensagens:** O bot envia mensagens via API do Evolution API ou similar
3. **Escala:** Vercel Serverless tem limites - considerar Workers ou queues externas no futuro
4. **Armazenamento:** QR codes e mídias podem precisar de storage externo (Vercel Blob ou S3)

---

## 7. Próximos Passos

1. Revisar SPEC e validar requisitos
2. Definir design visual (cores, tipografia, estética)
3. Iniciar implementação do projeto base