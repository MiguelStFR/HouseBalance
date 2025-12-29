# HouseBalance

Sistema de controle financeiro residencial, permitindo gerenciar **pessoas**, **categorias** e **transações**, além de exibir **relatórios e dashboard**.

---

## Tecnologias Utilizadas

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* LINQ
* DTOs para comunicação segura

### Frontend

* React + TypeScript
* Material UI
* Recharts
* Axios

### Banco de Dados

* EF Core + Migrations
* Relacionamentos entre tabelas

---

## Funcionalidades Principais

### Pessoas

* Cadastro de pessoas (nome + idade)
* Listagem de pessoas cadastradas
* Exclusão de pessoas
* Consulta de totais financeiros por pessoa:

  * Receitas
  * Despesas
  * Saldo

---

### Categorias

* Cadastro de categorias
* Finalidade da categoria:

  * Receita
  * Despesa
  * Ambas
* Exclusão com validação:

  * Bloqueia exclusão caso existam transações vinculadas
* Relatório de totais financeiros por categoria

### Transações

* Cadastro de transações com:

  * Descrição
  * Valor
  * Tipo (Receita / Despesa)
  * Pessoa vinculada
  * Categoria vinculada
* Listagem do histórico de transações
* Exclusão de transações
* Regras de negócio aplicadas:

  * Valor deve ser maior que zero
  * Categoria deve permitir o tipo informado
  * Menores de idade só podem registrar despesas

### Dashboard

Apresenta visão geral do sistema:

* Total de receitas
* Total de despesas
* Saldo geral

#### Visualizações

* Gráfico de pizza:

  * Saldo por pessoa
* Gráfico de barras:

  * Receitas x Despesas por categoria
* Tabelas:

  * Totais por pessoa
  * Totais por categoria

## Estrutura do Banco de Dados

### Pessoa

| Campo | Tipo   |
| ----- | ------ |
| Id    | int    |
| Nome  | string |
| Idade | int    |

### Categoria

| Campo      | Tipo                               |
| ---------- | ---------------------------------- |
| Id         | int                                |
| Descricao  | string                             |
| Finalidade | string (receita / despesa / ambas) |

### Transacao

| Campo       | Tipo     |
| ----------- | -------- |
| Id          | int      |
| Descricao   | string   |
| Valor       | decimal  |
| Tipo        | string   |
| PessoaId    | int (FK) |
| CategoriaId | int (FK) |

**Relacionamentos**

* Pessoa 1 → N Transações
* Categoria 1 → N Transações

## Controllers

### PessoaController

* GET `/pessoas`
* POST `/pessoas`
* DELETE `/pessoas/{id}`
* GET `/pessoas/totais`

### CategoriaController

* GET `/categorias`
* POST `/categorias`
* DELETE `/categorias/{id}`
* GET `/categorias/totais`

### TransacaoController

* GET `/transacoes`
* POST `/transacoes`
* DELETE `/transacoes/{id}`
