using MomentumCash.Domain.Entities;
using MomentumCash.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MomentumCash.Infrastructure.Data.Configurations;

public sealed class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).ValueGeneratedNever();

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.HasIndex(c => c.Name).IsUnique();

        SeedIncome(builder);
        SeedExpense(builder);
    }

    private static void SeedIncome(EntityTypeBuilder<Category> builder)
    {
        builder.HasData(new { Id = new Guid("11111111-1111-1111-1111-111111111101"), Name = "Salário", Type = TransactionTypeEnum.Income });
        builder.HasData(new { Id = new Guid("11111111-1111-1111-1111-111111111102"), Name = "Freelance", Type = TransactionTypeEnum.Income });
        builder.HasData(new { Id = new Guid("11111111-1111-1111-1111-111111111103"), Name = "Rendimentos", Type = TransactionTypeEnum.Income });
        builder.HasData(new { Id = new Guid("11111111-1111-1111-1111-111111111104"), Name = "Vendas", Type = TransactionTypeEnum.Income });
        builder.HasData(new { Id = new Guid("11111111-1111-1111-1111-111111111105"), Name = "Cashbacks", Type = TransactionTypeEnum.Income });
        builder.HasData(new { Id = new Guid("11111111-1111-1111-1111-111111111106"), Name = "Outros", Type = TransactionTypeEnum.Income });
    }

    private static void SeedExpense(EntityTypeBuilder<Category> builder)
    {
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222201"), Name = "Ensino", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222202"), Name = "Cartão de Crédito", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222203"), Name = "Empréstimo", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222204"), Name = "Habitação", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222205"), Name = "Alimentação", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222206"), Name = "Transporte", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222207"), Name = "Saúde", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222208"), Name = "Lazer", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222209"), Name = "Assinaturas", Type = TransactionTypeEnum.Expense });
        builder.HasData(new { Id = new Guid("22222222-2222-2222-2222-222222222210"), Name = "Imprevistos", Type = TransactionTypeEnum.Expense });
    }
}
