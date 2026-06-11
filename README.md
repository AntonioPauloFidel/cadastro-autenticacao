# Cadastro e Autenticação de Usuários

Sistema fullstack de cadastro e login de usuários com React no frontend e Node.js + SQLite no backend.

## Estrutura do Projeto

```
/
├── Frontend/   # React + React Hook Form + Axios
└── Backend/    # Node.js + Express + SQLite
```

## Como executar

### Backend

```bash
cd Backend
npm install
npm run dev
```

O servidor sobe em `http://localhost:3001`.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Endpoints da API

| Método | Rota                  | Descrição              |
|--------|-----------------------|------------------------|
| POST   | /api/auth/register    | Cadastro de usuário    |
| POST   | /api/auth/login       | Autenticação de usuário|

## Tecnologias

- **Frontend:** React 18, Vite, React Hook Form, Axios
- **Backend:** Node.js, Express, better-sqlite3, bcryptjs, express-validator
