using FluentMigrator;

namespace Shop.Data.Migrations;

[Migration(0000500)]
public class AddNewsletterSubscriberTable : Migration
{
    public override void Up()
    {
        Create.Table("NewsletterSubscriber")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Email").AsString().NotNullable().Unique()
            .WithColumn("IsActive").AsBoolean().NotNullable();
    }

    public override void Down()
    {
    }
}

[Migration(0000501)]
public class ExtendMetadataTable : Migration
{
    public override void Up()
    {
        Alter.Table("MetaData")
            .AddColumn("FaqText").AsString(int.MaxValue).WithDefaultValue("").NotNullable()
            .AddColumn("ContactText").AsString(int.MaxValue).WithDefaultValue("").NotNullable()
            .AddColumn("AboutText").AsString(int.MaxValue).WithDefaultValue("").NotNullable()
            .AddColumn("ImprintText").AsString(int.MaxValue).WithDefaultValue("").NotNullable();
    }

    public override void Down()
    {
    }
}

[Migration(0000502)]
public class ExtendOrderByShippingCostColumnTable : Migration
{
    public override void Up()
    {
        Alter.Table("Order")
            .AddColumn("ShippingCost").AsDecimal().WithDefaultValue(0m).NotNullable();
    }

    public override void Down()
    {
    }
}