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

[Migration(0000401)]
public class AddDocumentTable : Migration
{
    public override void Up()
    {
        Create.Table("Document")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("DocumentType").AsInt32().WithDefaultValue(0).NotNullable()
            .WithColumn("Description").AsString(int.MaxValue).Nullable()
            .WithColumn("FileId").AsString().Nullable()
            .WithColumn("FileExtension").AsString().NotNullable()
            .WithColumn("OrderId").AsInt64().Nullable();

        Create.ForeignKey().FromTable("Document").ForeignColumn("OrderId").ToTable("Order").PrimaryColumn("Id");
    }

    public override void Down()
    {
    }
}

[Migration(0000402)]
public class AddInvoiceNumberColumnToOrderTable : Migration
{
    public override void Up()
    {
        Alter.Table("Order")
            .AddColumn("InvoiceNumber").AsString().Nullable();
    }

    public override void Down()
    {
    }
}