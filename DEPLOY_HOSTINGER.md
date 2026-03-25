# Como Fazer Deploy no Hostinger (Guia Passo a Passo)

Este guia explica como colocar a Serena Glow online usando o Hostinger.

## Opção 1: Hostinger Shared Hosting (Node.js Selector)

Se você tem um plano de Hospedagem Compartilhada (Premium ou Business) que suporta Node.js:

1.  **Prepare os Arquivos Localmente**:
    *   No seu computador, abra o terminal na pasta do projeto.
    *   Execute: `npm run build:all`
    *   Isso criará as pastas `dist` (frontend) e `dist-server` (backend).

2.  **Upload via Gerenciador de Arquivos**:
    *   No painel do Hostinger, vá em **Arquivos > Gerenciador de Arquivos**.
    *   Suba todo o conteúdo da pasta do projeto (exceto `node_modules`).
    *   Certifique-se de que os arquivos `.env`, `package.json`, `dist` e `dist-server` estão lá.

3.  **Configurar Node.js no Painel**:
    *   Vá em **Avançado > Node.js**.
    *   **Node.js version**: Selecione 20 ou 22.
    *   **App root**: `/public_html` (ou a pasta onde você subiu os arquivos).
    *   **App URL**: Seu domínio (ex: `https://serenaglow.co.mz`).
    *   **Startup file**: `dist-server/index.js`.
    *   Clique em **Save**.

4.  **Instalar Dependências**:
    *   Ainda na página do Node.js, clique no botão **NPM Install**.

5.  **Variáveis de Ambiente**:
    *   Clique em **Edit Environment Variables** e adicione as chaves do `.env.example`:
        *   `VITE_SUPABASE_URL`
        *   `VITE_SUPABASE_ANON_KEY`
        *   `SUPABASE_SERVICE_ROLE_KEY`
        *   `PORT` (use 3001 ou o que o Hostinger sugerir)
    *   *Dica: Você também pode criar um arquivo `.env` real na pasta raiz.*

6.  **Reiniciar**:
    *   Clique em **Restart Application**.

---

## Opção 2: Hostinger VPS (Ubuntu/PM2)

Se você estiver usando um VPS:

1.  **SSH no Servidor**: `ssh root@seu_ip`
2.  **Clone o Repositório**: `git clone <seu_repo>`
3.  **Instale Dependências e Build**:
    ```bash
    npm install
    npm run build:all
    ```
4.  **Configurar PM2**:
    ```bash
    pm2 start ecosystem.config.cjs
    pm2 save
    pm2 startup
    ```
5.  **Nginx Proxy**: Configure o Nginx para apontar seu domínio para a porta `3001`.

---

## Notas Importantes

*   **Supabase**: Certifique-se de que a URL do seu site está na lista de URLs permitidas (Authentication > URL Configuration) no painel do Supabase.
*   **Imagens**: As imagens na pasta `public/images` serão servidas automaticamente.
*   **Erros**: Se o site não abrir, verifique os logs no painel do Hostinger em `logs/stderr.log`.
