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

[Migration(0000001)]
public class AddPhotoTable : Migration
{
    public override void Up()
    {
        Create.Table("Photo")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Bytes").AsBinary().Nullable()
            .WithColumn("Description").AsString()
            .WithColumn("FileExtension").AsString()
            .WithColumn("Size").AsDecimal(); 
    }

    public override void Down()
    {
    }
}