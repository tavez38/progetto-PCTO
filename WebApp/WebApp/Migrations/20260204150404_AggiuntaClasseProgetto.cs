using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AggiuntaClasseProgetto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "dipendenti",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "dipendenti",
                newName: "id");

            migrationBuilder.CreateTable(
                name: "progetti",
                columns: table => new
                {
                    id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IdProprietario = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    scadenza = table.Column<DateOnly>(type: "date", nullable: false),
                    orarioScadenza = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_progetti", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "progetti");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "dipendenti",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "dipendenti",
                newName: "Id");
        }
    }
}
