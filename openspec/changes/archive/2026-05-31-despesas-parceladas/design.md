## Context

A aplicação MomentumCash gerencia transações financeiras pontuais (receitas e despesas com data única). O modelo de domínio atual (`Transaction`) não contempla compras parceladas, que são essenciais para projeção de fluxo de caixa futuro. O frontend é vanilla JS com localStorage para cache offline; o backend é ASP.NET Core com EF Core + PostgreSQL, seguindo Clean Architecture com camadas Domain/Application/Infrastructure/Api.

## Goals / Non-Goals

**Goals:**
- Permitir que o usuário marque uma despesa como "Compra parcelada" e informe quantidade de parcelas + valor de cada parcela
- Persistir os dados de parcelamento no banco para consulta futura
- Exibir indicador de parcelamento na tabela de histórico (ex: "3/12 parcelas")
- Manter a experiência offline-first: dados de parcelamento são salvos localmente antes da sincronização com o servidor

**Non-Goals:**
- Geração automática de transações filhas (projeção de parcelas futuras como registros individuais) — isso será feito em change futuro
- Cálculo de juros compostos ou correção monetária
- Suporte a parcelamento de receitas (apenas despesas)
- Alteração do dashboard para exibir projeções futuras neste momento

## Decisions

### Decisão 1: Campos nullable na entidade Transaction vs. entidade filha `InstallmentSchedule`

**Escolha:** Adicionar `Installments` (int?) e `InstallmentValue` (decimal?) diretamente na entidade `Transaction`.

**Alternativa considerada:** Criar entidade `InstallmentSchedule` com relacionamento 1:N. Rejeitada por adicionar complexidade desnecessária no momento — a projeção de parcelas futuras será tratada em change separado, e ter os dados na própria transação é suficiente para persistência e exibição.

### Decisão 2: Sem value objects dedicados para Installments/InstallmentValue

**Escolha:** Usar tipos primitivos (`int?`, `decimal?`) com validação inline no método `Update()` e na factory `Create()`.

**Alternativa considerada:** Criar value objects `InstallmentCount` e `InstallmentValue` seguindo o padrão de `Money`/`TransactionDate`. Rejeitada porque a validação é simples (range check) e criar VOs para dois campos triviais aumentaria a verbosidade sem benefício proporcional. Se a lógica de parcelamento crescer, VOs podem ser extraídos depois.

### Decisão 3: Cálculo automático do valor da parcela no frontend

**Escolha:** Quando o usuário preenche o valor total e a quantidade de parcelas, preencher automaticamente `Valor da parcela = Valor total / Quantidade`. O campo "Valor da parcela" permanece editável para casos de arredondamento ou valor manual.

**Alternativa considerada:** Forçar cálculo automático sem edição manual. Rejeitada porque compras parceladas frequentemente têm valor de parcela arredondado (ex: valor total R$ 100,00 em 3x = 3x R$ 33,33 + última R$ 33,34).

### Decisão 4: Visibilidade condicional por checkbox/toggle

**Escolha:** Checkbox simples com classe CSS para mostrar/ocultar a seção de parcelamento via `display: none/block`. O campo "Tipo" já dispara `onTypeChange()` — este evento também resetará o toggle de parcelamento ao alternar entre Receita/Despesa.

**Alternativa considerada:** Switch/CSS toggle animado. Rejeitado por adicionar complexidade de CSS desnecessária; um checkbox com `<label>` estilizado é suficiente e mantém a simplicidade do Vanilla JS.

## Risks / Trade-offs

- **[Risco] Inconsistência entre Amount e InstallmentValue × Installments**: Usuário pode preencher valor total R$ 100, 3 parcelas, e digitar manualmente R$ 50 como valor da parcela (total parcelas = R$ 150). → **Mitigação**: Não forçar validação cruzada no formulário; o campo `installmentValue` representa o valor real de cada parcela, não necessariamente `amount / installments`. A responsabilidade de consistência é do usuário.

- **[Risco] Migração em tabela existente**: Colunas novas são `NULL`-able, então registros antigos não são afetados. → **Mitigação**: Sempre verificar `installments != null` antes de exibir indicador de parcelamento.

- **[Trade-off] Sem projeção futura neste change**: Os dados de parcelamento ficam disponíveis no banco, mas o dashboard ainda não os utiliza para projetar fluxo de caixa. → Isso será tratado em change futuro (`cash-flow-projection`).

## Open Questions

- Nenhuma pendência identificada. O escopo está bem definido e os padrões de código são consistentes em todas as camadas.
