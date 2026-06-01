using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VietJob.Migrations
{
    /// <inheritdoc />
    public partial class Update_Entities_ABP : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ungTuyenDungs",
                table: "ungTuyenDungs");

            migrationBuilder.RenameTable(
                name: "ungTuyenDungs",
                newName: "NhaTuyenDungs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_NhaTuyenDungs",
                table: "NhaTuyenDungs",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_NhaTuyenDungs",
                table: "NhaTuyenDungs");

            migrationBuilder.RenameTable(
                name: "NhaTuyenDungs",
                newName: "ungTuyenDungs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ungTuyenDungs",
                table: "ungTuyenDungs",
                column: "Id");
        }
    }
}
