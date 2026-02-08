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

[Migration(0000101)]
public class RelocateBinaryFileDataToFileStorage : Migration
{
    public override void Up()
    {
        Alter.Table("Image")
            .AddColumn("FileId").AsString(50).WithDefaultValue(null).Nullable();

        Delete.Column("Bytes").FromTable("Image");
        Delete.Column("Size").FromTable("Image");
    }

    public override void Down()
    {
    }
}