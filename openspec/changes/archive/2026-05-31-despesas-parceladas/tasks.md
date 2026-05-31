## 1. Backend — Domain

- [x] 1.1 Add `Installments` (int?) and `InstallmentValue` (decimal?) properties to `Transaction` entity
- [x] 1.2 Update `Transaction.Create()` factory method to accept optional `installments` and `installmentValue` parameters with validation (installments >= 2 when present, installmentValue > 0 when present)
- [x] 1.3 Update `Transaction.Update()` method to accept optional `installments` and `installmentValue` parameters
- [x] 1.4 Ensure installment fields are nullified when type is not Expense (Income transactions ignore installment data)

## 2. Backend — Application

- [x] 2.1 Add `int? Installments = null` and `decimal? InstallmentValue = null` to `CreateTransactionDto` record
- [x] 2.2 Add `int? Installments = null` and `decimal? InstallmentValue = null` to `UpdateTransactionDto` record
- [x] 2.3 Add `int? Installments` and `decimal? InstallmentValue` to `TransactionDto` record
- [x] 2.4 Update `TransactionService.MapToDto()` to include installment fields
- [x] 2.5 Update `TransactionService.CreateAsync()` to pass installment fields to domain factory
- [x] 2.6 Update `TransactionService.UpdateAsync()` to pass installment fields to domain Update method

## 3. Backend — Infrastructure

- [x] 3.1 Update `TransactionConfiguration` (EF Core) to map `Installments` and `InstallmentValue` columns
- [x] 3.2 Generate EF Core migration for new nullable columns

## 4. Frontend — HTML

- [x] 4.1 Add checkbox `<input type="checkbox" id="isInstallment">` with label "Compra parcelada?" after the type/category row, wrapped in a container with `display:none` by default
- [x] 4.2 Add container `id="installmentFields"` with inputs: `installments` (number, min 2) and `installmentValue` (number, step 0.01, min 0.01), both initially hidden

## 5. Frontend — JS (app.js)

- [x] 5.1 Add `isInstallment`, `installments`, `installmentValue` to `App.dom` cache in `cacheDom()`
- [x] 5.2 Implement `toggleInstallmentFields()`: show/hide checkbox based on type, show/hide fields based on checkbox state
- [x] 5.3 Integrate toggle logic into `onTypeChange()` — reset installment state when switching to Income
- [x] 5.4 Implement auto-calculation: when `installments` changes and `amount` has value, compute `installmentValue = amount / installments` (rounded to 2 decimals)
- [x] 5.5 Implement reverse auto-calculation: when `amount` changes and `installments` has value, update `installmentValue`
- [x] 5.6 Track manual edit flag — if user manually edits `installmentValue`, suppress auto-calculation until amount or installments changes again
- [x] 5.7 Update `handleSubmit()` to extract installment fields and include validation when checkbox is checked
- [x] 5.8 Update `createNew()` to include `installments` and `installmentValue` in the transaction object
- [x] 5.9 Update `updateExisting()` to include installment fields in the update payload
- [x] 5.10 Update `showFormForEdit()` to restore installment checkbox and field values when editing an installment transaction
- [x] 5.11 Update `renderTable()` to display "1/N parcelas" badge for transactions with `installments != null`
- [x] 5.12 Update `resetForm()` to reset all installment-related fields and state
- [x] 5.13 Update `showFieldErrors()` to include installment fields in validation highlight
- [x] 5.14 Bind events: checkbox `change`, `installments` input, `installmentValue` input, `amount` input

## 6. Frontend — JS (api.js)

- [x] 6.1 Include `installments` and `installmentValue` in `createTransaction()` POST body
- [x] 6.2 Include `installments` and `installmentValue` in `updateTransaction()` PUT body

## 7. Frontend — CSS

- [x] 7.1 Add `.installment-section` styles matching existing `.form__row` pattern
- [x] 7.2 Add `.installment-badge` style for the "1/N parcelas" indicator in the table

## 8. Verification

- [ ] 8.1 Manual test: create expense with installments, verify it appears in table with badge
- [ ] 8.2 Manual test: edit installment expense, verify fields restore correctly
- [ ] 8.3 Manual test: switch type to Income, verify installment section hides and resets
- [ ] 8.4 Manual test: auto-calculation for installment value works in both directions
- [ ] 8.5 Manual test: manual override of installment value is preserved
- [x] 8.6 Build backend and verify migration applies cleanly
