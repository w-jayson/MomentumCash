using MomentumCash.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MomentumCash.Infrastructure.Data.Configurations;

public sealed class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).ValueGeneratedNever();

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.HasOne(t => t.Category)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.ComplexProperty(t => t.Amount).IsRequired();
        builder.ComplexProperty(t => t.Date).IsRequired();
    }
}
