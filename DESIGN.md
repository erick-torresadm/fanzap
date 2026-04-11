# Fanzap - Design Specification

## 1. Purpose Statement
SaaS de automação de WhatsApp para pequenas empresas e empreendedores. Interface profissional, limpa e funcional para gerenciar instâncias, fluxos e mensagens.

## 2. Aesthetic Direction
**Industrial/Utilitarian** - Inspirado em painéis de controle profissionais e ferramentas de desenvolvimento. Visual robusto, funcional, com hierarquia clara e cores sóbrias.

## 3. Color Palette
- **Primary**: `#0F0F0F` (preto quase puro)
- **Secondary**: `#1A1A1A` (cinza escuro)
- **Accent**: `#00D9FF` (cyan brilhante - ação principal)
- **Success**: `#00C853` (verde)
- **Warning**: `#FFB300` (âmbar)
- **Error**: `#FF3D00` (vermelho alaranjado)
- **Background**: `#FAFAFA` (cinza muito claro)
- **Surface**: `#FFFFFF` (branco)
- **Text Primary**: `#0F0F0F`
- **Text Secondary**: `#6B7280`
- **Border**: `#E5E7EB`

## 4. Typography
- **Headings**: `JetBrains Mono` (monospace, técnico)
- **Body**: `IBM Plex Sans` (são, profissional)
- **Code**: `JetBrains Mono`

## 5. Layout Strategy
- Sidebar fixa à esquerda (240px)
- Conteúdo principal com padding generoso (32px)
- Cards com bordas sutis, sem sombras chamativas
- Grid responsivo com gap de 24px
- Ícones: Lucide (consistente)

## 6. Component Style
- **Buttons**: Borda sutil, texto claro em hover, transição rápida
- **Cards**: Borda 1px cinza, sem sombra ou sombra sutil
- **Inputs**: Borda cinza, focus com accent cyan
- **Badges**: Fundo colored com texto branco
- **Tables**: Linhas zebradas sutis

## 7. Páginas a Implementar
1. Landing Page (página inicial)
2. Dashboard (overview)
3. Instâncias (lista + criar + QR code)
4. Fluxos (lista + editor visual简)
5. Sequências (lista)
6. Gatilhos (lista)
7. Planos (pricing)
8. Configurações

## 8. Design System Tokens
```
--color-primary: #0F0F0F
--color-accent: #00D9FF
--color-success: #00C853
--color-warning: #FFB300
--color-error: #FF3D00
--color-bg: #FAFAFA
--color-surface: #FFFFFF
--color-border: #E5E7EB
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--font-heading: 'JetBrains Mono', monospace
--font-body: 'IBM Plex Sans', sans-serif
```