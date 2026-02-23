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

[Migration(0000202)]
public class ExtendProductTableByNewColumns : Migration
{
    public override void Up()
    {
        Alter.Table("Product")
            .AddColumn("AmountInStock").AsInt32().WithDefaultValue(0).NotNullable()
            .AddColumn("HighlightDescriptionsJson").AsString(int.MaxValue).Nullable()
            .AddColumn("DetailDescription").AsString(int.MaxValue).Nullable()
            .AddColumn("SafetyUsageDescription").AsString(int.MaxValue).Nullable();

        Rename.Column("Description").OnTable("Product").To("ShortDescription");
    }

    public override void Down()
    {
    }
}

[Migration(0000203)]
public class CreateMetaDataTable : Migration
{
    public override void Up()
    {
        Create.Table("MetaData")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("ShopEmail").AsString().NotNullable()
            .WithColumn("ShopPhone").AsString().Nullable()
            .WithColumn("FreeShippingThreshold").AsDecimal().NotNullable().WithDefaultValue(50)
            .WithColumn("BaseCurrency").AsString().NotNullable().WithDefaultValue("EURO")
            .WithColumn("ShippingReturnThreshold").AsInt32().NotNullable().WithDefaultValue(14)
            .WithColumn("ShippingAndReturnPolicyDescription").AsString(int.MaxValue).Nullable();
    }

    public override void Down()
    {
    }
}