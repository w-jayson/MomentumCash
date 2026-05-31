namespace MomentumCash.Application.DTOs;

public record TransactionDto(
    Guid Id,
    string Description,
    decimal Amount,
    DateTime Date,
    string Type,
    Guid? CategoryId,
    string? CategoryName,
    int? Installments = null,
    decimal? InstallmentValue = null
);
