# 📂 DBLS System - CLI

[![npm version](https://img.shields.io/npm/v/@dblssystem/cli)](https://www.npmjs.com/package/@dblssystem/cli)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Um simulador robusto de sistema de arquivos desenvolvido em Node.js, oferecendo uma experiência completa através de uma interface terminal interativa (TUI) e uma API REST escalável. Perfeito para fins educacionais, testes e prototipagem.

**Pacote NPM:** [`@dblssystem/cli`](https://www.npmjs.com/package/@dblssystem/cli)

---

## 📑 Índice

- [Visão Geral](#visão-geral)
- [Recursos Principais](#recursos-principais)
- [Instalação](#instalação)
- [Início Rápido](#início-rápido)
- [Uso](#uso)
  - [CLI (Interface Terminal)](#cli-interface-terminal)
  - [API REST](#api-rest)
- [Arquitetura](#arquitetura)
- [Modos de Operação](#modos-de-operação)
- [Comandos Disponíveis](#comandos-disponíveis)
- [Scripts NPM](#scripts-npm)
- [Dependências](#dependências)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 👀 Visão Geral

O DBLS System - CLI é um projeto educacional que simula um ambiente completo de gerenciamento de arquivos e pastas em Node.js. Ele centraliza toda a lógica de operações de filesystem em serviços reutilizáveis, permitindo consumo tanto pela interface terminal (TUI) quanto pela API REST.

O estado da aplicação persiste automaticamente em arquivos JSON, garantindo que as operações sejam rastreáveis e reproduzíveis.

---

## ✨ Recursos Principais

- **🖥️ Interface Terminal Interativa (TUI)**
  - Desenvolvida com `neo-blessed` para uma experiência visual aprimorada
  - Parser de comandos personalizado e inteligente
  - Sistema de sugestões de erro (`smartError`) com feedback contextual

- **🌐 API REST Completa**
  - Endpoints Express para todas as operações de filesystem
  - Consulta de configuração do sistema em tempo real
  - Acesso a metadados da máquina

- **📦 Pacote NPM**
  - Binário global `dbls-cli` para fácil execução
  - Publicado e pronto para distribuição

- **💾 Persistência de Dados**
  - Estado armazenado em JSON (`files.json`, `history.json`)
  - Suporta múltiplos escopos de operação (Local e Admin)

- **🔒 Dois Modos de Operação**
  - **Local:** Árvore virtual segura em `storage/`
  - **Admin:** Acesso ao diretório real do usuário Windows

---

## 📦 Instalação

### Via NPM (Globalmente)

```bash
npm install -g @dblssystem/cli
```

Após instalação, execute:

```bash
dbls-cli
```

### Via Git (Desenvolvimento)

```bash
git clone <seu-repositorio>
cd DBLS_system
npm install
```

### Requisitos

- **Node.js** ≥ 14.0.0
- **npm** ≥ 6.0.0
- Windows (para funcionalidade total de admin)

---

## 🚀 Início Rápido

### 1. Terminal Interativo

```bash
npm start
```

Inicie a interface terminal e comece a navegar:

```bash
> localstorage           # Ativa modo local
> c p=minha_pasta        # Cria uma pasta
> vai-para -> minha_pasta # Entra na pasta
> lr                     # Lista conteúdo
```

### 2. Servidor API

```bash
npm run api
```

A API estará disponível em `http://localhost:3000`

```bash
curl http://localhost:3000
# Resposta: DBLS System - CLI API 0.1 rodando
```

---

## 💻 Uso

### CLI (Interface Terminal)

A interface terminal oferece um ambiente de linha de comando completo para gerenciar arquivos e pastas.

#### Exemplo de Sessão

```bash
npm start

Welcome to DBLS System - CLI v1.1.1

> localstorage
✓ Modo local ativado

> c p=Projetos
✓ Pasta "Projetos" criada com sucesso

> c a=relatorio tipo=pdf
✓ Arquivo "relatorio.pdf" criado

> lr
📁 Projetos/
📄 relatorio.pdf

> vai-para -> Projetos
[Projetos] > c a=dados tipo=json
✓ Arquivo "dados.json" criado

> lr
📄 dados.json
```

### API REST

A API REST permite integração programática com o sistema.

#### Endpoints Disponíveis

```http
GET  /                    # Status da API
GET  /system              # Configuração do sistema
GET  /machine             # Metadados da máquina
GET  /files               # Listar arquivos atuais
POST /files               # Criar arquivo/pasta
DELETE /files/:id         # Deletar arquivo/pasta
GET  /navigate/:path      # Navegar para caminho
```

#### Exemplos com cURL

```bash
# Verificar status
curl http://localhost:3000

# Criar pasta
curl -X POST http://localhost:3000/files \
  -H "Content-Type: application/json" \
  -d '{"type": "folder", "name": "nova_pasta"}'

# Listar arquivos
curl http://localhost:3000/files
```

---

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
src/
├── core/               # Núcleo da aplicação
│   ├── parser.js       # Parser de comandos personalizado
│   └── smartError.js   # Sistema de sugestões inteligentes
├── filesystem/         # Operações de filesystem
│   ├── index.js        # Agregador de serviços
│   ├── files/          # Serviço de arquivos
│   ├── folders/        # Serviço de pastas
│   ├── machine/        # Serviço de máquina
│   ├── navigation/     # Serviço de navegação
│   └── system/         # Serviço de sistema
├── system/             # Configuração do sistema
│   ├── config/
│   │   └── system.json
│   └── services/
├── machine/            # Metadados da máquina
│   ├── config/
│   │   └── machine.json
│   └── services/
├── data/               # Persistência de dados
│   ├── files.json      # Estado dos arquivos
│   └── history.json    # Histórico de operações
├── ui/                 # Interface de usuário
│   └── terminal.js     # TUI com neo-blessed
└── server/             # API REST
    └── app.js          # Aplicação Express

storage/               # Armazenamento local
└── DB/user/           # Dados persistentes
```

### Fluxo de Dados

```
Input (CLI/API)
    ↓
Parser/Router
    ↓
Serviços Filesystem
    ↓
Persistência (JSON)
    ↓
Output (Terminal/HTTP)
```

---

## 🎯 Modos de Operação

| Modo | Ativação | Escopo | Caso de Uso |
|------|----------|--------|-----------|
| **Local** | `localstorage` | Árvore virtual em `storage/` | Desenvolvimento e testes seguros |
| **Admin** | `admin` | Diretório real `C:\Users` | Acesso ao sistema de arquivos real |

**Exemplo:**

```bash
> localstorage
✓ Modo local ativado - operações em storage/

> admin
✓ Modo admin ativado - acesso ao C:\Users
```

---

## 📋 Comandos Disponíveis

### Criação

| Ação | Comando | Exemplo |
|------|---------|---------|
| Criar pasta | `c p=nome` | `c p=minha_pasta` |
| Criar arquivo | `c a=nome tipo=tipo` | `c a=relatorio tipo=pdf` |

### Listagem

| Ação | Comando | Exemplo |
|------|---------|---------|
| Listar atual | `lr` | `lr` |
| Filtrar por tipo (arquivo) | `lr --tipo=a` | `lr --tipo=a` |
| Filtrar por tipo (pasta) | `lr --tipo=p` | `lr --tipo=p` |
| Listar subpasta | `lr nome` | `lr minha_pasta` |
| Listar com filtro | `lr nome --tipo=a` | `lr minha_pasta --tipo=a` |

### Navegação

| Ação | Comando | Exemplo |
|------|---------|---------|
| Entrar em pasta | `vai-para -> nome` | `vai-para -> minha_pasta` |
| Voltar um nível | `voltar` | `voltar` |

### Deleção

| Ação | Comando | Exemplo |
|------|---------|---------|
| Deletar pasta | `d p=nome` | `d p=minha_pasta` |
| Deletar arquivo | `d a=nome tipo=tipo` | `d a=relatorio tipo=pdf` |
| Forçar deleção | `d p=nome --force` | `d p=minha_pasta --force` |

---

## 📜 Scripts NPM

```bash
# Iniciar terminal interativo
npm start

# Iniciar servidor API (porta 3000)
npm run api

# Instalar como binário global
npm install -g .

# Executar CLI após instalação global
dbls-cli
```

---

## 📚 Dependências

| Pacote | Versão | Propósito |
|--------|--------|----------|
| **express** | ^5.2.1 | Framework web para API REST |
| **neo-blessed** | ^0.2.0 | Interface terminal interativa (TUI) |
| **dotenv** | ^17.4.2 | Gerenciamento de variáveis de ambiente |
| **fs-extra** | ^11.3.4 | Utilitários avançados para filesystem |
| **uuid** | ^14.0.0 | Geração de identificadores únicos |

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes

- Mantenha a coerência de código
- Adicione testes para novas funcionalidades
- Atualize a documentação conforme necessário
- Siga o padrão ESLint do projeto

---

## 📄 Licença

Este projeto é licenciado sob a **Licença ISC** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

Encontrou um problema? Abra uma [issue](../../issues) no repositório!

---

**Desenvolvido com ❤️ por [davidben0000]**
| Abrir no SO     | `start=local` / `start --p=pasta`                      |
| Configuração    | `config` / `config --machine`                          |
| Ajuda           | `manual`                                               |
| Limpar / Sair   | `limpar` ou `cls` / `encerrar` ou `exit`               |


## API REST

Base: `http://localhost:3000`


| Método | Rota               | Descrição                                         |
| ------ | ------------------ | ------------------------------------------------- |
| GET    | `/system`          | Configuração do sistema                           |
| GET    | `/machine`         | Informações da máquina                            |
| GET    | `/fs/list`         | Lista diretório atual (`?tipo=a|p`)               |
| GET    | `/fs/list/:folder` | Lista pasta específica                            |
| POST   | `/fs/folder`       | Cria pasta (`{ "name": "..." }`)                  |
| POST   | `/fs/file`         | Cria arquivo (`{ "name", "type" }`)               |
| DELETE | `/fs/folder`       | Remove pasta (`name`, `force`)                    |
| DELETE | `/fs/file`         | Remove arquivo (`name`, `type`, `force`)          |
| POST   | `/fs/cd`           | Navega para pasta (`{ "folder" }`)                |
| POST   | `/fs/back`         | Retorna um nível                                  |
| POST   | `/fs/start`        | Abre pasta no sistema operacional (`{ "param" }`) |


## Execução

Requisitos: Node.js (CommonJS), dependências instaladas via `npm install`.

**CLI local**

```bash
npm start
```

**API**

```bash
npm run api
```

**Pacote global (npm)**

```bash
npx @dblssystem
```

Dependências principais
- `express` — servidor HTTP da API
- `neo-blessed` — interface de terminal
- `fs-extra` — operações de filesystem e persistência JSON
- `uuid` — identificadores únicos
- `dotenv` — variáveis de ambiente (quando configurado)

## Licença

ISC