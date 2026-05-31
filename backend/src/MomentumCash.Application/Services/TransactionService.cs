using MomentumCash.Application.DTOs;
using MomentumCash.Domain.Entities;
using MomentumCash.Domain.Enums;
using MomentumCash.Domain.Interfaces;

namespace MomentumCash.Application.Services;

public sealed class TransactionService
{
    private readonly ITransactionRepository _repository;

    public TransactionService(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<DashboardDto> GetDashboardAsync(CancellationToken ct = default)
    {
        var transactions = await _repository.GetAllAsync(ct);

        var totalIncome = transactions
            .Where(t => t.Type == TransactionTypeEnum.Income)
            .Sum(t => t.Amount.Value);

        var totalExpense = transactions
            .Where(t => t.Type == TransactionTypeEnum.Expense)
            .Sum(t => t.Amount.Value);

        var transactionDtos = transactions
            .OrderByDescending(t => t.Date.Value)
            .Select(MapToDto)
            .ToList();

        return new DashboardDto(
            totalIncome - totalExpense,
            totalIncome,
            totalExpense,
            transactionDtos
        );
    }

    public async Task<TransactionDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var transaction = await _repository.GetByIdAsync(id, ct);
        return transaction is null ? null : MapToDto(transaction);
    }

    public async Task<TransactionDto> CreateAsync(CreateTransactionDto dto, CancellationToken ct = default)
    {
        var transaction = Transaction.Create(
            dto.Description,
            dto.Amount,
            dto.Date,
            (TransactionTypeEnum)dto.Type,
            dto.CategoryId
        );

        _repository.Add(transaction);
        return MapToDto(transaction);
    }

    public async Task<TransactionDto?> UpdateAsync(Guid id, UpdateTransactionDto dto, CancellationToken ct = default)
    {
        var transaction = await _repository.GetByIdAsync(id, ct);
        if (transaction is null)
            return null;

        transaction.Update(
            dto.Description,
            dto.Amount,
            dto.Date,
            (TransactionTypeEnum)dto.Type,
            dto.CategoryId
        );

        _repository.Update(transaction);
        return MapToDto(transaction);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var transaction = await _repository.GetByIdAsync(id, ct);
        if (transaction is null)
            return false;

        _repository.Delete(transaction);
        return true;
    }

    private static TransactionDto MapToDto(Transaction t)
    {
        return new TransactionDto(
            t.Id,
            t.Description,
            t.Amount.Value,
            t.Date.Value,
            t.Type == TransactionTypeEnum.Income ? "income" : "expense",
            t.CategoryId,
            t.Category?.Name
        );
    }
}
