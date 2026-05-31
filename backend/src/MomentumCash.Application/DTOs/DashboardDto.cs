namespace MomentumCash.Application.DTOs;

public record DashboardDto(
    decimal TotalBalance,
    decimal TotalIncome,
    decimal TotalExpense,
    List<TransactionDto> Transactions
);
