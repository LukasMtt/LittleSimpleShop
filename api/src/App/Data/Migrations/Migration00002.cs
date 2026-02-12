using FluentMigrator;

namespace Shop.Data.Migrations;

[Migration(0000200)]
public class AddSpecialCategoryTypeColumn : Migration
{
    public override void Up()
    {
        Alter.Table("Category")
            .AddColumn("CategoryType").AsInt32().WithDefaultValue(0).NotNullable();
    }

    public override void Down()
    {
    }
}

[Migration(0000201)]
public class RenameImageTable : Migration
{
    public override void Up()
    {
        Rename.Table("Image").To("PublicImage");
    }

    public override void Down()
    {
    }
}