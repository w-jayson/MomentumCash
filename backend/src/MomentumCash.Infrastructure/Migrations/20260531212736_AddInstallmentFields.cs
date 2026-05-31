using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MomentumCash.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInstallmentFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "installment_value",
                table: "Transactions",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "installments",
                table: "Transactions",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "installment_value",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "installments",
                table: "Transactions");
        }
    }
}
