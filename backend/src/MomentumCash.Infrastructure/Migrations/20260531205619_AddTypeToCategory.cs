using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MomentumCash.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTypeToCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: true),
                    Amount_Value = table.Column<decimal>(type: "numeric", nullable: false),
                    Date_Value = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name", "Type" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111101"), "Salário", 1 },
                    { new Guid("11111111-1111-1111-1111-111111111102"), "Freelance", 1 },
                    { new Guid("11111111-1111-1111-1111-111111111103"), "Rendimentos", 1 },
                    { new Guid("11111111-1111-1111-1111-111111111104"), "Vendas", 1 },
                    { new Guid("11111111-1111-1111-1111-111111111105"), "Cashbacks", 1 },
                    { new Guid("11111111-1111-1111-1111-111111111106"), "Outros", 1 },
                    { new Guid("22222222-2222-2222-2222-222222222201"), "Ensino", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222202"), "Cartão de Crédito", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222203"), "Empréstimo", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222204"), "Habitação", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222205"), "Alimentação", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222206"), "Transporte", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222207"), "Saúde", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222208"), "Lazer", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222209"), "Assinaturas", 2 },
                    { new Guid("22222222-2222-2222-2222-222222222210"), "Imprevistos", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CategoryId",
                table: "Transactions",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
