
# DM HATS 🎩

**Sistema de venda, personalização e gerenciamento de chapéus.**

Projeto desenvolvido pelo grupo **Os Trapalhões**, com o objetivo de centralizar a apresentação de produtos, a personalização de chapéus e a divulgação de serviços em uma única plataforma.

## 📌 Sobre o projeto

A DM HATS é uma aplicação web que permite aos clientes visualizar chapéus disponíveis, conhecer os serviços oferecidos e personalizar modelos de acordo com suas preferências.

O sistema também possui uma área administrativa para gerenciar os produtos e serviços cadastrados.

## ✨ Funcionalidades

### Para os clientes

- Visualização do catálogo de chapéus.
- Consulta de preços, descrições e imagens dos produtos.
- Personalização de chapéus, com escolha de modelo, tamanho e acessórios.
- Visualização do valor estimado da personalização.
- Consulta dos serviços oferecidos.
- Contato com a loja pelo WhatsApp.

### Para o administrador

- Login administrativo.
- Cadastro de produtos e serviços.
- Edição de produtos e serviços.
- Exclusão de registros.
- Upload de imagens dos produtos.
- Proteção das operações administrativas por autenticação com token JWT.

## 🛠️ Tecnologias utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript (ES Modules)
- Uploadcare para envio de imagens.

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT para autenticação.
- bcryptjs para proteção de senhas.
- CORS
- dotenv

## 🏗️ Arquitetura

O projeto está dividido em dois repositórios:

| Parte | Repositório |
|---|---|
| Frontend | [tf-web-frontend](https://github.com/jcdbf-a11y/tf-web-frontend) |
| Backend / API | [tf-web-tema](https://github.com/jcdbf-a11y/tf-web-tema) |

O frontend realiza as requisições HTTP para a API, responsável pelo processamento das operações e pela comunicação com o banco de dados PostgreSQL.

## 🌐 Projeto publicado

- **Site:** https://tf-web-frontend.vercel.app/
- **API:** https://tf-web-tema.vercel.app/
- **Status da API:** https://tf-web-tema.vercel.app/status

## 💻 Como executar localmente

### 1. Clonar os repositórios

Frontend:

```bash
git clone https://github.com/jcdbf-a11y/tf-web-frontend.git
```

Backend:

```bash
git clone https://github.com/jcdbf-a11y/tf-web-tema.git
```

### 2. Configurar o backend

Entre na pasta do backend:

```bash
cd tf-web-tema
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL="sua_url_de_conexao_postgresql"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

Configure as variáveis com os dados do seu ambiente.

Execute a aplicação:

```bash
npm run dev
```

### 3. Executar o frontend

Abra a pasta `tf-web-frontend` em um editor de código.

Utilize uma extensão como **Live Server** para executar o projeto no navegador.

Por padrão, o frontend está configurado para utilizar a API publicada. Para utilizar uma API local, ajuste a constante `API_URL` em `js/api.js` para:

```javascript
const API_URL = 'http://localhost:3000';
```

## 👥 Integrantes

**Grupo: Os Trapalhões**

- [Breno Henrique Rodrigues Rocha](https://github.com/bhrr-alt)
- [Enzo Noah](https://github.com/QualquerNome139)
- [Gustavo Santos](https://github.com/Didi-show)
- [Júlio César Dias Barbosa Filho](https://github.com/jcdbf-a11y)
- [Matheus Henrique](https://github.com/matheus44244)

---

Desenvolvido como projeto acadêmico.
