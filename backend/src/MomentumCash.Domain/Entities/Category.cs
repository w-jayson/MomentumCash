using MomentumCash.Domain.Enums;

namespace MomentumCash.Domain.Entities;

public sealed class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = null!;
    public TransactionTypeEnum Type { get; private set; }

    private readonly List<Transaction> _transactions = [];
    public IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();

#pragma warning disable CS8618
    private Category() { }
#pragma warning restore CS8618

    public Category(string name, TransactionTypeEnum type)
    {
        Id = Guid.NewGuid();
        SetName(name);
        Type = type;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty.", nameof(name));

        Name = name.Trim();
    }

    public void SetType(TransactionTypeEnum type)
    {
        Type = type;
    }
}
