using FluentMigrator;

namespace Shop.Data.Migrations;

[Migration(0000000)]
public class AddCategoryTable : Migration
{
    public override void Up()
    {
        Create.Table("Category")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Name").AsString().Nullable();
    }

    public override void Down()
    {
    }
}

[Migration(0000001)]
public class AddProductTable : Migration
{
    public override void Up()
    {
        Create.Table("Product")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Name").AsString().Nullable()
            .WithColumn("Description").AsString().Nullable()
            .WithColumn("CategoryId").AsInt64().Nullable();

        Create.ForeignKey().FromTable("Product").ForeignColumn("CategoryId").ToTable("Category").PrimaryColumn("Id");
    }

    public override void Down()
    {
    }
}

[Migration(0000002)]
public class AddImageTable : Migration
{
    public override void Up()
    {
        Create.Table("Image")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Bytes").AsBinary().Nullable()
            .WithColumn("Description").AsString()
            .WithColumn("FileExtension").AsString()
            .WithColumn("Size").AsDecimal()
            .WithColumn("CategoryId").AsInt64().Nullable()
            .WithColumn("ProductId").AsInt64().Nullable();

        Create.ForeignKey().FromTable("Image").ForeignColumn("CategoryId").ToTable("Category").PrimaryColumn("Id");
        Create.ForeignKey().FromTable("Image").ForeignColumn("ProductId").ToTable("Product").PrimaryColumn("Id");
    }

    public override void Down()
    {
    }
}