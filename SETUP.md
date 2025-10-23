# Finance Wise - Setup Guide

## Configuração do Google OAuth

Para usar autenticação com Google, você precisa:

1. **Criar um projeto no Google Cloud Console**
   - Acesse: https://console.cloud.google.com/
   - Crie um novo projeto
   - Ative a API "Google+ API"

2. **Criar credenciais OAuth 2.0**
   - Vá para "Credenciais"
   - Clique em "Criar credenciais" > "ID do cliente OAuth"
   - Selecione "Aplicativo da Web"
   - Adicione URIs autorizados:
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-dominio.vercel.app` (produção)
   - Copie o Client ID e Client Secret

3. **Adicionar variáveis de ambiente**
   
   No seu projeto Vercel, adicione as seguintes variáveis de ambiente:
   
   \`\`\`
   GOOGLE_CLIENT_ID=seu_client_id_aqui
   GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
   NEXTAUTH_SECRET=gere_uma_chave_aleatoria_aqui
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   DATABASE_URL=sua_url_do_banco_de_dados
   \`\`\`

4. **Gerar NEXTAUTH_SECRET**
   
   Execute no terminal:
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`

5. **Configurar banco de dados**
   
   Execute o script SQL em `scripts/init-db.sql` no seu banco de dados PostgreSQL.

## Variáveis de Ambiente Necessárias

- `GOOGLE_CLIENT_ID` - ID do cliente Google OAuth
- `GOOGLE_CLIENT_SECRET` - Secret do cliente Google OAuth
- `NEXTAUTH_SECRET` - Chave secreta para NextAuth (gere com openssl)
- `NEXTAUTH_URL` - URL da sua aplicação
- `DATABASE_URL` - URL de conexão do PostgreSQL

## Executar localmente

\`\`\`bash
npm install
npm run dev
\`\`\`

Acesse `http://localhost:3000`
