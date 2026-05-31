namespace MomentumCash.Domain.ValueObjects;

public sealed class Money
{
    public decimal Value { get; private set; }

    private Money() { Value = 0; }

    public Money(decimal Value)
    {
        if (Value < 0)
            throw new ArgumentException("Amount cannot be negative.", nameof(Value));

        this.Value = Value;
    }

    public override string ToString() => Value.ToString("F2");

    public static implicit operator decimal(Money money) => money.Value;
}
