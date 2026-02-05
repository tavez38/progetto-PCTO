using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp.Migrations
{
    /// <inheritdoc />
    public partial class newMessaggiMigration20 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "messaggi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    titolo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    contenuto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dataInvio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    mittente = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    destinatario = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_messaggi", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "messaggi");
        }
    }
}
