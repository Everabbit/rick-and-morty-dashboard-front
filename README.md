# Rick and Morty Dashboard - Frontend

Aplicacao frontend em Vue 3 + Quasar para explorar personagens de Rick and Morty com filtros, paginacao, metricas e visualizacoes.

## Tecnologias

- Vue 3 + TypeScript
- Quasar (CLI Vite)
- Pinia (estado global)
- Vue Router
- Axios
- ESLint + Prettier

## Funcionalidades

- Listagem paginada de personagens
- Filtros por nome, especie, tipo, origem, localizacao, status, genero e faixa de episodios
- Ordenacao por campos da API (ASC e DESC)
- Cards de metricas (total, pagina, status da sincronizacao)
- Graficos de distribuicao por status, genero e top especies
- Modal com detalhes do personagem
- Estado da pagina refletido na URL (query params)
- Cache local em memoria para personagens e status de sincronizacao

## Requisitos

- Node.js 20+
- npm 9+ (ou yarn)

## Variaveis de ambiente

Crie um arquivo `.env` na pasta `front` com:

```env
VITE_API_URL=/api
```

### Sobre `VITE_API_URL`

- Em desenvolvimento local, o valor recomendado e `/api` para usar o proxy do Quasar para `http://localhost:3000`.
- Em producao, use a URL base publica da API, por exemplo:

```env
VITE_API_URL=https://seu-dominio-api.com/api
```

## Instalacao

```bash
npm install
```

## Executando em desenvolvimento

```bash
npm run dev
```

O Quasar abre a aplicacao em modo dev com hot reload.

## Scripts disponiveis

- `npm run dev`: inicia o frontend em desenvolvimento
- `npm run build`: gera build de producao (saida em `dist/spa`)
- `npm run lint`: executa lint com ESLint
- `npm run format`: formata arquivos com Prettier
- `npm run test`: placeholder (nao possui testes implementados)

## Integracao com a API

O frontend consome os endpoints:

- `GET /characters`
- `GET /sync/status`

Com `VITE_API_URL=/api`, as chamadas ficam:

- `GET /api/characters`
- `GET /api/sync/status`

Se estiver usando os repositorios separados no GitHub, a stack Docker da API (API + Postgres + Worker) esta no repositorio da API, no arquivo `api/docker-compose.yml`.

## Estrutura principal

```text
src/
	api/           # Cliente HTTP
	boot/          # Inicializacao do Axios
	components/    # UI (filtros, cards, graficos, grid)
	pages/         # Paginas (dashboard)
	stores/        # Estado global (Pinia)
	interfaces/    # Contratos TypeScript
	enums/         # Enums compartilhados no front
```

## Fluxo da pagina principal

1. Le parametros da URL e hidrata filtros.
2. Carrega personagens com debounce.
3. Atualiza a URL quando filtros/paginacao mudam.
4. Calcula metricas e dados dos graficos a partir da pagina atual.
5. Busca status da ultima sincronizacao da API.

## Build e deploy

### Build local

```bash
npm run build
```

Artefatos gerados em `dist/spa`.

### Vercel

O projeto ja possui `vercel.json` configurado com:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist/spa`
- fallback de rota para `index.html` (SPA)

## Troubleshooting rapido

### Erro de CORS

Garanta que a URL do frontend esteja permitida no backend.

### Front nao encontra a API

Confira `VITE_API_URL` e se a API esta ativa em `http://localhost:3000`.

### Filtros nao aparecem na URL

Verifique se a rota principal esta carregando sem bloqueios do navegador/extensoes.
