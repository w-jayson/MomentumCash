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

#pragma warning disable CS8618
    private Transaction() { }
#pragma warning restore CS8618

    public static Transaction Create(
        string description,
        decimal amount,
        DateTime date,
        TransactionTypeEnum type,
        Guid? categoryId = null)
    {
        return new Transaction
        {
            Id = Guid.NewGuid(),
            Description = ValidateDescription(description),
            Amount = new Money(amount),
            Date = new TransactionDate(date),
            Type = type,
            CategoryId = categoryId
        };
    }

    public void Update(
        string description,
        decimal amount,
        DateTime date,
        TransactionTypeEnum type,
        Guid? categoryId = null)
    {
        Description = ValidateDescription(description);
        Amount = new Money(amount);
        Date = new TransactionDate(date);
        Type = type;
        CategoryId = categoryId;
    }

    private static string ValidateDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description cannot be empty.", nameof(description));

        return description.Trim();
    }
}
