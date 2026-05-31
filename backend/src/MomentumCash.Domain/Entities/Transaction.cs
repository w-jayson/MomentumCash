using MomentumCash.Domain.Enums;
using MomentumCash.Domain.ValueObjects;

namespace MomentumCash.Domain.Entities;

public sealed class Transaction
{
    public Guid Id { get; private set; }
    public string Description { get; private set; }
    public Money Amount { get; private set; }
    public TransactionDate Date { get; private set; }
    public TransactionTypeEnum Type { get; private set; }
    public Guid? CategoryId { get; private set; }
    public Category? Category { get; private set; }
    public int? Installments { get; private set; }
    public decimal? InstallmentValue { get; private set; }

#pragma warning disable CS8618
    private Transaction() { }
#pragma warning restore CS8618

    public static Transaction Create(
        string description,
        decimal amount,
        DateTime date,
        TransactionTypeEnum type,
        Guid? categoryId = null,
        int? installments = null,
        decimal? installmentValue = null)
    {
        var validatedInstallments = ValidateInstallments(type, installments, installmentValue);

        return new Transaction
        {
            Id = Guid.NewGuid(),
            Description = ValidateDescription(description),
            Amount = new Money(amount),
            Date = new TransactionDate(date),
            Type = type,
            CategoryId = categoryId,
            Installments = validatedInstallments.installments,
            InstallmentValue = validatedInstallments.installmentValue
        };
    }

    public void Update(
        string description,
        decimal amount,
        DateTime date,
        TransactionTypeEnum type,
        Guid? categoryId = null,
        int? installments = null,
        decimal? installmentValue = null)
    {
        Description = ValidateDescription(description);
        Amount = new Money(amount);
        Date = new TransactionDate(date);
        Type = type;
        CategoryId = categoryId;

        var validated = ValidateInstallments(type, installments, installmentValue);
        Installments = validated.installments;
        InstallmentValue = validated.installmentValue;
    }

    private static (int? installments, decimal? installmentValue) ValidateInstallments(
        TransactionTypeEnum type,
        int? installments,
        decimal? installmentValue)
    {
        if (type != TransactionTypeEnum.Expense || installments is null)
            return (null, null);

        if (installments < 2)
            throw new ArgumentException("Installments must be at least 2.", nameof(installments));

        if (installmentValue is null or <= 0)
            throw new ArgumentException("Installment value must be greater than zero.", nameof(installmentValue));

        return (installments, installmentValue);
    }

    private static string ValidateDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description cannot be empty.", nameof(description));

        return description.Trim();
    }
}
