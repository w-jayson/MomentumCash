namespace MomentumCash.Application.DTOs;

public record UpdateTransactionDto(
    string Description,
    decimal Amount,
    DateTime Date,
    int Type,
    Guid? CategoryId = null
);
