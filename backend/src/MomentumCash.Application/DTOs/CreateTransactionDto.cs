namespace MomentumCash.Application.DTOs;

public record CreateTransactionDto(
    string Description,
    decimal Amount,
    DateTime Date,
    int Type,
    Guid? CategoryId = null
);
