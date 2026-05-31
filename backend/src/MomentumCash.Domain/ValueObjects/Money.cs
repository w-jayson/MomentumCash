namespace MomentumCash.Domain.ValueObjects;

public sealed record Money
{
    public decimal Value { get; }

    public Money(decimal value)
    {
        if (value < 0)
            throw new ArgumentException("Amount cannot be negative.", nameof(value));

        Value = value;
    }

    public override string ToString() => Value.ToString("F2");

    public static implicit operator decimal(Money money) => money.Value;
}
