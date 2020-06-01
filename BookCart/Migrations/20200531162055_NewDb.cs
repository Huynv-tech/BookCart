using Microsoft.EntityFrameworkCore.Migrations;

namespace SampleTest.Migrations
{
    public partial class NewDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(unicode: false, maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Categori__19093A2B46B8DFC9", x => x.CategoryID);
                });

            migrationBuilder.CreateTable(
                name: "Document",
                columns: table => new
                {
                    documentId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    Description = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    Owner = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    Category = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    Content = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    MineType = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    CoverFileName = table.Column<string>(unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Document", x => x.documentId);
                });

            migrationBuilder.CreateTable(
                name: "UserMaster",
                columns: table => new
                {
                    UserID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    LastName = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    Username = table.Column<string>(unicode: false, maxLength: 20, nullable: false),
                    Password = table.Column<string>(unicode: false, maxLength: 40, nullable: false),
                    Gender = table.Column<string>(unicode: false, maxLength: 6, nullable: false),
                    UserTypeID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserMast__1788CCAC2694A2ED", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "UserType",
                columns: table => new
                {
                    UserTypeID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserTypeName = table.Column<string>(unicode: false, maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserType", x => x.UserTypeID);
                });

            migrationBuilder.InsertData(
                table: "UserMaster",
                columns: new[] { "UserID", "FirstName", "Gender", "LastName", "Password", "UserTypeID", "Username" },
                values: new object[] { 1, "Nguyen", "Famale", "Huy", "Huy123!@#", 1, "admin" });

            migrationBuilder.InsertData(
                table: "UserMaster",
                columns: new[] { "UserID", "FirstName", "Gender", "LastName", "Password", "UserTypeID", "Username" },
                values: new object[] { 2, "Tran", "Famale", "Test", "Huy123!@#", 2, "contributors" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Document");

            migrationBuilder.DropTable(
                name: "UserMaster");

            migrationBuilder.DropTable(
                name: "UserType");
        }
    }
}
