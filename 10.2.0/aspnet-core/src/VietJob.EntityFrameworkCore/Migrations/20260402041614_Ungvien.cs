using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VietJob.Migrations
{
    /// <inheritdoc />
    public partial class Ungvien : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HoTen",
                table: "UngViens",
                newName: "Ten");

            migrationBuilder.AddColumn<string>(
                name: "Ho",
                table: "UngViens",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ho",
                table: "UngViens");

            migrationBuilder.RenameColumn(
                name: "Ten",
                table: "UngViens",
                newName: "HoTen");
        }
    }
}
