namespace MomentumCash.Domain.ValueObjects;

public sealed record TransactionDate
{
    public DateTime Value { get; }

    public TransactionDate(DateTime value)
    {
        if (value == default)
            throw new ArgumentException("Transaction date cannot be the default value.", nameof(value));

        Value = value;
    }

    public override string ToString() => Value.ToString("yyyy-MM-dd");

    public static implicit operator DateTime(TransactionDate date) => date.Value;
}
