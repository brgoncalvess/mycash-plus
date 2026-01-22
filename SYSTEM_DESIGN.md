# Documento Descritivo do Sistema mycash+

## 🎯 VISÃO GERAL DO SISTEMA
O mycash+ é um sistema web completo de gestão financeira familiar que permite múltiplos membros de uma família controlarem suas finanças de forma colaborativa. O sistema funciona como uma aplicação de página única onde o usuário navega entre diferentes seções sem recarregar a página.

## 🏗️ ESTRUTURA DE NAVEGAÇÃO

### Sistema de Abas
Cinco seções principais:
1. **Dashboard** (inicial)
2. **Objetivos**
3. **Cartões**
4. **Transações**
5. **Perfil**

### Sidebar Desktop
- **Estado Expandido**: Logo completo, nomes das seções, perfil com foto/nome/email.
- **Estado Colapsado**: Ícone logo, ícones seções (tooltips ao passar mouse), foto perfil.
- **Transição**: Botão circular na borda direita para alternar. Animação suave.
- **Estilo Ativo**: Fundo preto, texto branco, ícone verde limão.
- **Estilo Inativo**: Fundo transparente, texto cinza.

### Header Mobile
- Sidebar desaparece.
- Header fixo no topo: Logo esquerda, Avatar direita.
- **Menu Dropdown**: Ao clicar no avatar, desliza menu com as opções de navegação e Logout.

## 💾 SISTEMA DE DADOS E ESTADO

### Contexto Global (useFinance)
Armazenamento central para:
- **Transações**: { id, type (income/expense), amount, description, category, date, accountId, memberId, installments, status }
- **Objetivos**: { name, description, image, targetAmount, currentAmount, category, deadline, status }
- **Cartões**: { name, closingDay, dueDay, limit, currentInvoice, theme (black/lime/white), logoUrl, last4Digits }
- **Contas**: { name, type, balance, color }
- **Membros**: { name, role, photoUrl, income }
- **Categorias**: Receitas e Despesas separadas.

### Funções de Cálculo
- Saldo Total, Receitas/Despesas do Período, Taxa de Economia, Gastos por Categoria/Membro.

### Filtros Globais
- **Membro**: Filtra tudo por membro específico.
- **Período**: Filtra por intervalo de datas.
- **Tipo**: Todos/Receitas/Despesas.
- **Busca**: Texto livre.

## 🏠 DASHBOARD - COMPONENTES

### Header Dashboard
- **Busca**: Filtra em tempo real.
- **Filtros Avançados**: Popover (desktop) ou Modal (mobile) para Tipo (Radio).
- **Seletor de Período**: Calendário interativo.
- **Widget Membros**: Avatares empilhados. Seleção filtra o dashboard.
- **Botão Nova Transação**: Modal de criação.

### Cards de Resumo
1. **Saldo Total**: Preto, grande destaque.
2. **Receitas**: Branco, ícone entrada.
3. **Despesas**: Branco, ícone saída.

### Categorias e Fluxo
- **Carrossel de Categorias**: Cards com Donut chart (percentual). Ordenado por valor.
- **Gráfico Fluxo Financeiro**: Área chart (Receitas vs Despesas) ao longo dos meses.

### Widgets Secundários
- **Cartões**: Lista simplificada com paginação. Visual dos cards varia por tema.
- **Próximas Despesas**: Lista cronológica de contas a pagar. Check para marcar como pago.
- **Objetivos**: Grid de cards (Imagem + Progresso).
- **Tabela de Transações**: Detalhada, paginada, filtrável.

## 🔄 MODAIS
- **Nova Transação**: Formulário completo com validação.
- **Adicionar Membro/Cartão**.
- **Detalhes do Cartão**.
- **Filtros Mobile**.

## 🎨 DESIGN & INTERAÇÕES
- **Cores**: Verde Limão (Brand), Preto (Dark), Branco (Light), Cinzas.
- **Aesthetics**: Glassmorphism, sombras suaves (elevation), bordas arredondadas.
- **Animações**: Hover scale, fade-in, slide-in, transition on filters.
- **Responsividade**: Mobile, Tablet, Desktop.
