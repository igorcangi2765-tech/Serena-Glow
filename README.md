# Serena Glow – Beauty Salon Management System

Sistema profissional de gestão para salão de beleza, incluindo frontend React e backend Node.js (Express).

## 🧱 Estrutura do Projecto

- `frontend/`: Aplicação React (Vite)
- `backend/`: API Node.js/Express com Prisma (PostgreSQL)

## 🚀 Como Executar Localmente

### 1. Pré-requisitos

- Node.js (v18+)
- PostgreSQL (ou MongoDB - configurável via Prisma)

### 2. Instalação

No diretório raiz, executa:

```bash
npm run install:all
```

### 3. Configuração

#### Backend
Cria um ficheiro `.env` dentro da pasta `backend/` seguindo o `.env.example`:
- `DATABASE_URL`: URL da tua base de dados PostgreSQL.
- `JWT_SECRET`: Uma chave aleatória para o JWT.

#### Base de Dados
Para inicializar as tabelas, corre dentro da pasta `backend/`:

```bash
npx prisma migrate dev --name init
```

### 4. Execução

Para correr o frontend e o backend simultaneamente:

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3005](http://localhost:3005)

## 🔐 Autenticação

O sistema utiliza JWT para autenticação.
- **Admin**: Acesso total
- **Staff**: Acesso limitado (sem configurações/serviços)

## 🛠️ Tecnologias Usadas

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, Prisma ORM, JWT, BcryptJS.
- **Base de Dados**: PostgreSQL (recomendado).

## ⚠️ Notas de Desenvolvimento

- Nenhuma alteração de layout foi feita no frontend original.
- Toda a lógica de integração foi movida para os respectivos serviços no frontend.
-Tratamento de erros robusto implementado no backend e frontend.
