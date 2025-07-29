# Sistema de Controle e Manutenção - Documentação Técnica

## 📋 Visão Geral

Este projeto é um **Sistema de Controle e Manutenção** desenvolvido com Next.js 15 e React 19, que permite gerenciar itens e suas respectivas manutenções com controle de acesso baseado em roles (ADMIN/OPERADOR).

### Tecnologias Principais
- **Frontend**: Next.js 15.4.4 + React 19.1.0 + TypeScript
- **Backend**: Express.js + JSON Server (simulação de API)
- **Autenticação**: JWT com bcrypt para hash de senhas
- **Styling**: Tailwind CSS 4.1.11
- **Testes**: Jest + React Testing Library
- **Validação**: Zod para schemas de validação

---

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

## 🔐 Sistema de Autenticação

### 1. Backend (Express + JSON Server)

**Arquivo**: `backend/server.js`

```javascript
// Configuração de CORS para permitir requests do frontend
server.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Rota de Login
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value(); // Busca usuários no db.json
  const user = users.find(u => u.email === email);

  // Verifica senha com bcrypt e gera JWT
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
});
```

**Características**:
- Utiliza `bcrypt` para hash seguro de senhas
- JWT com expiração de 1 hora
- Separação entre dados sensíveis (password) e dados retornados

### 2. Frontend - Context de Autenticação

**Arquivo**: `src/context/AuthContext.tsx`

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Função de login que comunica com a API
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await res.json()
    Cookies.set('token', data.token, { expires: 7, path: '/', sameSite: 'strict' })
    setUser(data.user) // Atualiza estado global do usuário
  }

  // useEffect para restaurar sessão ao recarregar página
  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token')
      if (!token) return setLoading(false)

      // Valida token com endpoint /me
      const res = await fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    }
    fetchUser()
  }, [])
}
```

**Funcionalidades**:
- **Estado Global**: Gerencia usuário logado em toda aplicação
- **Persistência**: Usa cookies HTTP-only para segurança
- **Restauração de Sessão**: Verifica token ao recarregar página
- **Loading State**: Evita flash de conteúdo durante carregamento

### 3. Middleware de Proteção de Rotas

**Arquivo**: `src/middleware.ts`

```typescript
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    // Usa biblioteca 'jose' compatível com Edge Runtime
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const decoded = payload as JwtPayload
    
    // Verifica permissões para páginas admin
    const isAdminPage = req.nextUrl.pathname.startsWith('/dashboard/users')
    if (isAdminPage && decoded.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/maintenance', req.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/home'] // Rotas protegidas
}
```

**Características Técnicas**:
- **Edge Runtime**: Usa `jose` em vez de `jsonwebtoken` por compatibilidade
- **Server-Side Protection**: Validação antes mesmo da página carregar
- **Role-based Access**: Diferentes permissões por tipo de usuário
- **Automatic Redirects**: Redirecionamento transparente para o usuário

---

## 🎯 Camada de Serviços

### Estrutura da API Layer

**Arquivo**: `src/lib/api.ts`
```typescript
export const API = 'http://localhost:3001'
```

**Arquivo**: `src/services/authService.ts`
```typescript
export const login = async (email: string, password: string) => {
  console.log('Tentando login com:', { email, password })
  
  const response = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Falha na autenticação')
  }

  return response.json()
}
```

**Padrão Aplicado**:
- **Service Layer**: Abstração da camada de dados
- **Error Handling**: Tratamento centralizado de erros
- **Type Safety**: Retornos tipados com TypeScript
- **Logging**: Debug de requests para desenvolvimento

---

## 🧩 Componentes e UI

### 1. Sistema de Alertas

**Arquivo**: `src/context/AlertContext.tsx`

```typescript
interface AlertContextProps {
  showAlert: (message: string, type: 'success' | 'error' | 'warning') => void
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<Alert | null>(null)

  const showAlert = (message: string, type: Alert['type']) => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000) // Auto-dismiss
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert message={alert.message} type={alert.type} />}
    </AlertContext.Provider>
  )
}
```

### 2. Componente de Loading

**Arquivo**: `src/components/Loader.tsx`

```typescript
export function Loader() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  )
}
```

### 3. Modal Reutilizável

**Arquivo**: `src/components/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
```

---

## 📊 Gerenciamento de Estado

### 1. Padrão Context + Provider

```typescript
// Estrutura típica de um Context
const Context = createContext<ContextProps>(defaultValue)

export function Provider({ children }) {
  const [state, setState] = useState(initialState)
  
  // Lógica de negócio
  const actions = {
    action1: () => setState(newState),
    action2: async () => { /* async logic */ }
  }

  return (
    <Context.Provider value={{ state, ...actions }}>
      {children}
    </Context.Provider>
  )
}

export const useContext = () => useContext(Context)
```

### 2. Estados Locais com Hooks

```typescript
// Padrão para componentes com estado local
function Component() {
  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
      .then(data => setData(data))
      .catch(() => setError('Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error) return <Alert message={error} />
  
  return <div>{/* render data */}</div>
}
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

### Proteção de Rotas Implementada

1. **Middleware**: Proteção server-side antes do componente carregar
2. **Component Guards**: Verificação adicional nos componentes
3. **Redirect Logic**: Redirecionamento baseado em role do usuário

```typescript
// Exemplo de guard em componente
function ProtectedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading])

  if (loading) return <Loader />
  if (!user) return null

  return <div>{/* conteúdo protegido */}</div>
}
```

---

## 🧪 Estratégia de Testes

### Configuração Jest

**Arquivo**: `jest.config.js`
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Exemplo de Teste de Serviço

**Arquivo**: `src/test/AuthService.test.tsx`
```typescript
import { login } from '@/services/authService'

// Mock do fetch global
global.fetch = jest.fn()

describe('AuthService', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('deve realizar login com sucesso', async () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      user: { id: 1, name: 'Test User', email: 'test@test.com', role: 'ADMIN' }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await login('test@test.com', 'password')
    
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    })
    
    expect(result).toEqual(mockResponse)
  })
})
```

### Teste de Componente React

**Arquivo**: `src/test/RegisterForm.test.tsx`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterForm from '@/components/RegisterForm'

describe('RegisterForm', () => {
  it('deve submeter formulário com dados válidos', async () => {
    const mockOnSuccess = jest.fn()
    
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'João Silva' }
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'joao@test.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha123' }
    })
    
    fireEvent.click(screen.getByText('Cadastrar'))
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})
```

---

## 🔧 Validação de Dados

### Schemas Zod

**Arquivo**: `src/lib/validators/itemSchema.ts`
```typescript
import { z } from 'zod'

export const itemSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.enum(['ATIVO', 'INATIVO', 'MANUTENCAO'])
})

export type ItemFormData = z.infer<typeof itemSchema>
```

### Integração com React Hook Form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function ItemForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema)
  })

  const onSubmit = (data: ItemFormData) => {
    // dados já validados pelo Zod
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nome')} />
      {errors.nome && <span>{errors.nome.message}</span>}
    </form>
  )
}
```

---

## 🚀 Deployment e Scripts

### Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "next dev --turbopack",      // Desenvolvimento com Turbopack
    "dev:json": "json-server --watch db.json --port 3001", // Backend de desenvolvimento
    "build": "next build",             // Build de produção
    "start": "next start",             // Servidor de produção
    "lint": "next lint"                // Linting
  }
}
```

### Script de Inicialização

**Arquivo**: `start.sh`
```bash
#!/bin/bash

# Instala dependências se necessário
if [ ! -d "node_modules" ]; then
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    cd backend && npm install && cd ..
fi

# Inicia backend e frontend em paralelo
cd backend && node server.js &
BACKEND_PID=$!

cd .. && npm run dev &
FRONTEND_PID=$!

# Cleanup ao sair
trap 'kill $BACKEND_PID $FRONTEND_PID' EXIT
wait
```

---

## 🔒 Segurança

### Medidas Implementadas

1. **Hash de Senhas**: bcrypt com salt rounds
2. **JWT Seguro**: Expiração + secret key forte
3. **CORS Configurado**: Origem específica permitida
4. **Cookies Secure**: SameSite + HttpOnly (quando possível)
5. **Validação Server-Side**: Middleware + validação de schemas
6. **Type Safety**: TypeScript previne erros de tipos

### Variáveis de Ambiente

```bash
# .env.local
JWT_SECRET=sua_chave_secreta_super_segura

# backend/.env
JWT_SECRET=sua_chave_secreta_super_segura
```

---

## 📈 Performance

### Otimizações Aplicadas

1. **Next.js 15**: App Router + Server Components
2. **Turbopack**: Bundler mais rápido em desenvolvimento
3. **Lazy Loading**: Componentes carregados sob demanda
4. **Image Optimization**: Next.js Image component
5. **Code Splitting**: Automático pelo Next.js

### Monitoramento

- Console logs para debug em desenvolvimento
- Error boundaries para captura de erros
- Loading states para melhor UX

---

## 🛠️ Manutenção e Extensibilidade

### Padrões Seguidos

1. **Separation of Concerns**: Camadas bem definidas
2. **DRY Principle**: Componentes e hooks reutilizáveis
3. **Type Safety**: Interfaces TypeScript em toda aplicação
4. **Error Handling**: Tratamento consistente de erros
5. **Consistent Naming**: Convenções de nomenclatura claras

### Estrutura de Tipos

```typescript
// src/types/user.ts
export interface User {
  id: number
  name: string
  email: string
  role: Role
}

// src/types/role.ts
export enum Role {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR'
}

// src/types/maintenance.ts
export interface Maintenance {
  id: string
  itemId: string
  performedAt: string
  description: string
  technician: string
}
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

Esta documentação fornece uma visão completa da arquitetura e implementação do sistema, servindo como guia para desenvolvedores que trabalharão com o projeto.