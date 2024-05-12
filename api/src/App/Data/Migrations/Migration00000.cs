using FluentMigrator;

namespace Shop.Data.Migrations;

[Migration(0000000)]
public class AddProductTable : Migration
{
    public override void Up()
    {
        Create.Table("Product")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("ProductName").AsString().Nullable();
    }

    public override void Down()
    {
    }
}