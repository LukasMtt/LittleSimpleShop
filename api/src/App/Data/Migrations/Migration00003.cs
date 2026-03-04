using FluentMigrator;

namespace Shop.Data.Migrations;

[Migration(0000300)]
public class AddProductAmountDbSideConstraint : Migration
{
    public override void Up()
    {
        //can do, no migration without pre existing (prod) data
        Delete.Column("AmountInStock").FromTable("Product");
        Execute.Sql("ALTER TABLE dbo.Product ADD AmountInStock INT NOT NULL DEFAULT 0 CONSTRAINT CHK_AmountInStock_GTEZero CHECK (AmountInStock >= 0);");
    }

    public override void Down()
    {
    }
}

[Migration(0000301)]
public class ShipmentTargetAndAddressTable : Migration
{
    public override void Up()
    {
        Create.Table("ShipmentAddress")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Street").AsString(int.MaxValue).NotNullable()
            .WithColumn("Number").AsString().NotNullable()
            .WithColumn("Addition").AsString(int.MaxValue).Nullable()
            .WithColumn("City").AsString(int.MaxValue).NotNullable()
            .WithColumn("Country").AsInt32().WithDefaultValue(0).NotNullable()
            .WithColumn("Zip").AsString().NotNullable();

        Create.Table("ShipmentTarget")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("FirstName").AsString(int.MaxValue).NotNullable()
            .WithColumn("LastName").AsString(int.MaxValue).NotNullable()
            .WithColumn("CompanyName").AsString(int.MaxValue).Nullable()
            .WithColumn("Email").AsString(int.MaxValue).NotNullable()
            .WithColumn("IsNewsletterActivated").AsBoolean().NotNullable()
            .WithColumn("Phone").AsString().Nullable()
            .WithColumn("AddressId").AsInt64().Nullable();

        Create.ForeignKey().FromTable("ShipmentTarget").ForeignColumn("AddressId").ToTable("ShipmentAddress").PrimaryColumn("Id");
    }

    public override void Down()
    {
    }
}

[Migration(0000302)]
public class AddCartAndOrderProperties : Migration
{
    public override void Up()
    {
        Alter.Table("Cart")
            .AddColumn("State").AsInt32().WithDefaultValue(0).NotNullable();

        Alter.Table("Order")
            .AddColumn("DiscountCode").AsString().Nullable()
            .AddColumn("State").AsInt32().WithDefaultValue(0).NotNullable()
            .AddColumn("OrderToken").AsString().Nullable()
            .AddColumn("CartId").AsInt64().Nullable()
            .AddColumn("ShipmentTargetId").AsInt64().Nullable();

        Create.ForeignKey().FromTable("Order").ForeignColumn("CartId").ToTable("Cart").PrimaryColumn("Id");
        Create.ForeignKey().FromTable("Order").ForeignColumn("ShipmentTargetId").ToTable("ShipmentTarget").PrimaryColumn("Id");
    }

    public override void Down()
    {
    }
}

[Migration(0000303)]
public class AddOrderShippingRelatedProperties : Migration
{
    public override void Up()
    {
        Alter.Table("Order")
            .AddColumn("ShippingProviderOrderId").AsString().Nullable()
            .AddColumn("ShippingProvider").AsInt32().Nullable();
    }

    public override void Down()
    {
    }
}