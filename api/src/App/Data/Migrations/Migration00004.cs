using FluentMigrator;

namespace Shop.Data.Migrations;

[Migration(0000400)]
public class AddOrderEmailTable : Migration
{
    public override void Up()
    {
        Create.Table("OrderEmail")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("OrderId").AsInt64().NotNullable()
            .WithColumn("OrderEMailType").AsInt32().WithDefaultValue(0).NotNullable()
            .WithColumn("SendDate").AsDateTime().NotNullable();

        Create.ForeignKey().FromTable("OrderEmail").ForeignColumn("OrderId").ToTable("Order").PrimaryColumn("Id");
    }

    public override void Down()
    {
    }
}