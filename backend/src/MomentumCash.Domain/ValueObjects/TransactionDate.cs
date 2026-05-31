namespace MomentumCash.Domain.ValueObjects;

public sealed class TransactionDate
{
    public DateTime Value { get; private set; }

    private TransactionDate() { Value = DateTime.MinValue; }

    public TransactionDate(DateTime Value)
    {
        if (Value == default)
            throw new ArgumentException("Transaction date cannot be the default value.", nameof(Value));

        this.Value = Value;
    }

    public override string ToString() => Value.ToString("yyyy-MM-dd");

    public static implicit operator DateTime(TransactionDate date) => date.Value;
}
