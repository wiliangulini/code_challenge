# Sistema de Controle e Manutenção 🔧

## 📋 Visão Geral

Este projeto é um **Sistema de Controle e Manutenção** completo desenvolvido com Next.js 15 e React 19, que permite gerenciar itens e suas respectivas manutenções com controle de acesso baseado em roles (ADMIN/OPERADOR).

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
code_challenge/
├── backend/              # API Backend (Express + JSON Server)
├── src/
│   ├── app/             # App Router do Next.js 13+
│   │   ├── (private)/   # Rotas privadas protegidas
│   │   ├── dashboard/   # Páginas do dashboard
│   │   ├── login/       # Página de login
│   │   ├── register/    # Página de registro
│   │   └── layout.tsx   # Layout raiz da aplicação
│   ├── components/      # Componentes reutilizáveis
│   ├── context/         # Contextos React (Auth, Alert)
│   ├── lib/            # Utilitários e configurações
│   ├── services/       # Camada de serviços/API
│   ├── types/          # Definições TypeScript
│   └── middleware.ts   # Middleware de autenticação
└── tests/              # Testes unitários
```

---

## 🛣️ Roteamento e Navegação

### App Router (Next.js 13+)

```
src/app/
├── layout.tsx           # Layout raiz
├── page.tsx            # Página inicial (/)
├── login/
│   └── page.tsx        # /login
├── register/
│   └── page.tsx        # /register
├── (private)/          # Grupo de rotas (não afeta URL)
│   └── home/
│       └── page.tsx    # /home
└── dashboard/
    ├── items/
    │   └── page.tsx    # /dashboard/items
    └── maintenance/
        └── page.tsx    # /dashboard/maintenance
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/wiliangulini/code_challenge.git
cd sistema-manutencao
```

### 2. Instale as dependências
```bash
# Dependências do frontend
npm install

# Dependências do backend
cd backend
npm install
cd ..
```

### 3. Configure as variáveis de ambiente
```bash
# Crie o arquivo .env.local na raiz do projeto
JWT_SECRET=sua_chave_secreta_super_segura > .env.local

# Crie o arquivo .env no diretório backend
JWT_SECRET=sua_chave_secreta_super_segura > backend/.env
```

### 4. Execute o projeto

#### Opção A: Script automático
```bash

chmod +x start.sh
./start.sh
```

#### Opção B: Manualmente
```bash
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
npm run dev
```

### 5. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### 👤 Usuários Padrão

| Email | Senha | Role |
|-------|-------|------|
| admin@example.com | 1234567 | ADMIN |
| wilian@email.com | 123456 | OPERADOR |

---

## 🧪 Executar Testes

```bash
# Rodar todos os testes
npm test

# Testes em modo observação
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

---

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia o desenvolvimento com Turbopack
npm run build        # Build de produção
npm run start        # Inicia o servidor de produção
npm run lint         # Executa o linter
npm test             # Executa os testes
```

---

## 🎯 Próximos Passos Sugeridos

1. **Database Real**: Migrar de JSON Server para PostgreSQL/MySQL
2. **Cache Layer**: Implementar Redis para sessões
3. **Real-time Updates**: WebSockets para atualizações em tempo real
4. **File Upload**: Sistema de upload de imagens/documentos
5. **Audit Log**: Rastreamento de ações dos usuários
6. **Email Service**: Notificações por email
7. **Mobile App**: React Native para versão mobile
8. **Docker**: Containerização para deployment
9. **CI/CD**: Pipeline automatizado
10. **Monitoring**: APM e logging estruturado

---