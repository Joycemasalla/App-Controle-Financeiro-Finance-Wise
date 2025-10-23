# Finance Wise - Instruções de Setup

## O que foi implementado

A aplicação agora funciona **sem autenticação no servidor**, usando **localStorage** para armazenar dados de cada usuário separadamente. Isso significa:

✅ Múltiplos usuários podem usar a aplicação no mesmo navegador (em abas diferentes)
✅ Cada usuário tem seus próprios dados isolados
✅ Não há necessidade de banco de dados ou autenticação complexa
✅ Funciona 100% offline

## Como usar

### 1. Fazer Login/Registro

**Opção 1: Usar credenciais de teste**
- Email: `teste@financewie.com`
- Senha: `senha123`

**Opção 2: Criar uma nova conta**
- Clique em "Registre-se"
- Preencha nome, email e senha
- Clique em "Registrar"

### 2. Acessar o Dashboard

Após fazer login, você será redirecionado para o dashboard onde pode:
- Ver resumo de receitas, despesas e saldo
- Adicionar novas transações
- Visualizar gráficos
- Gerenciar lembretes

### 3. Logout

Clique no botão de logout na navbar para sair. Seus dados serão mantidos no localStorage.

## Estrutura de Dados

Os dados são armazenados no localStorage com as seguintes chaves:

\`\`\`
users                          // Lista de todos os usuários registrados
currentUser                    // Email do usuário logado
userName                       // Nome do usuário logado
transactions_{email}           // Transações do usuário
reminders_{email}              // Lembretes do usuário
loans_{email}                  // Empréstimos do usuário
\`\`\`

## Passo a Passo para Testar

1. **Abra a aplicação** em seu navegador
2. **Faça login** com as credenciais de teste
3. **Adicione algumas transações** (receitas e despesas)
4. **Veja os gráficos** atualizarem em tempo real
5. **Faça logout** e teste com outro usuário
6. **Verifique** que os dados de cada usuário estão isolados

## Dados de Teste Pré-carregados

Ao fazer login com `teste@financewie.com`, você terá acesso a uma conta de teste com alguns dados de exemplo.

## Próximos Passos (Opcional)

Se quiser adicionar mais funcionalidades:

1. **Sincronização com servidor**: Conectar ao Neon para sincronizar dados
2. **Backup automático**: Exportar dados para arquivo JSON
3. **Compartilhamento**: Permitir compartilhar transações com outros usuários
4. **Notificações**: Adicionar lembretes via email ou push

## Troubleshooting

**Problema**: Dados desaparecem após fechar o navegador
**Solução**: Os dados estão no localStorage e devem persistir. Verifique se o localStorage não está sendo limpo automaticamente.

**Problema**: Não consigo fazer login
**Solução**: Verifique se o email e senha estão corretos. Tente criar uma nova conta.

**Problema**: Dados de outro usuário aparecem
**Solução**: Limpe o localStorage e faça login novamente. Use `localStorage.clear()` no console.
