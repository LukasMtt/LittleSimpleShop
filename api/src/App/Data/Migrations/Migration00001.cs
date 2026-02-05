using FluentMigrator;

namespace Shop.Data.Migrations;

[Migration(0000100)]
public class AddProductStateColumn : Migration
{
    public override void Up()
    {
        Alter.Table("Product")
            .AddColumn("LifecycleState").AsInt32().WithDefaultValue(0).NotNullable();
    }

    public override void Down()
    {
    }
}